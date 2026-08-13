import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';
import { CreateProductRequest } from '../models/create-product.request';

@Injectable({
  providedIn: 'root',
})
export class ProductStore {
  private readonly productService = inject(ProductService);

  readonly products = signal<Product[]>([]);
  readonly totalProducts = computed(() => this.products().length);
  readonly hasProducts = computed(() => this.totalProducts() > 0);

  constructor() {
    this.load();
  }

  load(): void {
    this.productService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  create(request: CreateProductRequest): void {
    this.productService.create(request).subscribe({
      next: (newProduct) => {
        this.products.update((products) => [...products, newProduct]);
      },
      error: (err) => console.error('Erro ao criar produto:', err)
    });
  }

  getById(id: string): Product | undefined {
    return this.products().find((product) => product.id === id);
  }

  update(id: string, request: CreateProductRequest): void {
    this.productService.update(id, request).subscribe({
      next: (updatedProduct) => {
        if (!updatedProduct) return;

        this.products.update((products) =>
          products.map((product) =>
            product.id === id ? updatedProduct : product
          )
        );
      },
      error: (err) => console.error('Erro ao atualizar produto:', err)
    });
  }

  remove(id: string): void {
    this.productService.remove(id).subscribe({
      next: (removed) => {
        if (!removed) return;

        this.products.update((products) =>
          products.filter((product) => product.id !== id)
        );
      },
      error: (err) => console.error('Erro ao remover produto:', err)
    });
  }

  toggleActive(id: string): boolean {
    const existingProduct = this.getById(id);

    if (!existingProduct) {
      return false;
    }

    const updatedProduct: Product = {
      ...existingProduct,
      active: !existingProduct.active,
      updatedAt: new Date(),
    };

    // Nota: Se a alteração de status precisar persistir no back-end/localStorage,
    // o ideal seria criar um método no service e assinar aqui de forma similar ao update.
    this.products.update((products) =>
      products.map((product) => (product.id === id ? updatedProduct : product))
    );
    return true;
  }
}
