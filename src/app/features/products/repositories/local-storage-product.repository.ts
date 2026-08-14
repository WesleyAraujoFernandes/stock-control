import { inject, Injectable } from '@angular/core';
import { ProductRepository } from './product.repository';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';
import { Product } from '../models/product.model';
import { StorageService } from '../services/storage.service';
import { PRODUCT_STORAGE_KEY } from '../constants/product-storage.constants';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageProductRepository extends ProductRepository {
  private readonly storage = inject(StorageService);

  override getById(id: string): Product | undefined {
    return this.readProducts().find((product) => product.id === id);
  }

  override getProducts(): Observable<Product[]> {
    return of(this.readProducts());
  }

  override create(request: CreateProductRequest): Observable<Product> {
    const products = this.readProducts();

    const newProduct: Product = {
      ...request,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
      active: true,
    };

    this.saveProducts([...products, newProduct]);
    return of(newProduct);
  }

  override update(id: string, request: UpdateProductRequest): Observable<Product | undefined> {
    const products = this.readProducts();
    const existingProduct = products.find((product) => product.id === id);

    if (!existingProduct) {
      return of(undefined);
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...request,
      id: existingProduct.id,
      createdAt: new Date(existingProduct.createdAt),
      updatedAt: new Date(),
    };

    const updatedProducts = products.map((product) =>
      product.id === id ? updatedProduct : product
    );

    this.saveProducts(updatedProducts);
    return of(updatedProduct);
  }

  override remove(id: string): Observable<boolean> {
    const products = this.readProducts();
    const productExists = products.some((product) => product.id === id);

    if (!productExists) {
      return of(false);
    }

    const remainingProducts = products.filter((product) => product.id !== id);
    this.saveProducts(remainingProducts);

    return of(true);
  }

  private saveProducts(products: Product[]): void {
    this.storage.set(PRODUCT_STORAGE_KEY, products);
  }

  private readProducts(): Product[] {
    const storedProducts = this.storage.get<Product[]>(PRODUCT_STORAGE_KEY);
    if (!storedProducts) {
      return [];
    }

    return storedProducts.map((product) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    }));
  }
}
