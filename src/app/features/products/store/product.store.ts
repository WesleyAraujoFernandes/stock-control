import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CreateProductRequest } from '../models/create-product.request';
import {
  catchError,
  finalize,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { UpdateProductRequest } from '../models/update-product.request';
import { ApiError } from '../../../core/errors/api-error';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly totalProducts = computed(() => this.products().length);
  readonly hasProducts = computed(() => this.totalProducts() > 0);
  readonly error = signal<string | null>(null);
  readonly loading = signal(false);

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.productService
      .getProducts()
      .pipe(
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (products) => {
          this.products.set(products);
        },
        error: (error: ApiError) => {
          this.error.set(error.message);
        },
      });
  }

  create(request: CreateProductRequest): Observable<Product> {
    return this.productService.create(request).pipe(
      tap((createdProduct) => {
        this.products.update((products) => [
          ...products,
          createdProduct,
        ]);
      })
    );
  }

  getById(id: string): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  update(id: string, request: UpdateProductRequest): Observable<Product> {
    this.error.set(null);
    return this.productService.update(id, request).pipe(
      tap((updatedProduct) => {
        this.products.update((products) =>
          products.map((product) => (product.id === id ? updatedProduct : product))
        );
      })
    );
  }

  remove(id: string): Observable<void> {
    return this.productService.remove(id).pipe(
      tap(() => {
        this.products.update((products) => products.filter((product) => product.id !== id));
      }),
      catchError((error) => {
        this.error.set('Não foi possível remover o produto: ' + error);
        return throwError(() => error);
      })
    );
  }

  toggleActive(id: string): Observable<Product | undefined> {
    return this.productService.toggleActive(id).pipe(
      tap((updatedProduct) => {
        if (!updatedProduct) {
          return;
        }
        console.log("update active:", updatedProduct.active);
        this.products.update((products) =>
          products.map((product) => (product.id === id ? updatedProduct : product))
        );
      }),
      catchError((error) => {
        this.error.set('Não foi possível alterar o status do produto: ' + error);
        return throwError(() => error);
      })
    );
  }
}
