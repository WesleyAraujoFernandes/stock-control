import { inject, Injectable } from '@angular/core';
import { ProductRepository } from './product.repository';
import { CreateProductRequest } from '../models/create-product.request';
import { Product } from '../models/product.model';
import { StorageService } from '../services/storage.service';
import { PRODUCT_STORAGE_KEY } from '../constants/product-storage.constants';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageProductRepository extends ProductRepository {

  private readonly storage = inject(StorageService);

  override getProducts(): Product[] {
    const storedProducts = this.storage.get<Product[]>(PRODUCT_STORAGE_KEY);

    if (!storedProducts) {
      return [];
    }

    return storedProducts.map((product) => ({
      ...product,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
    }))
  }
  override create(request: CreateProductRequest): Product {
    const product: Product = {
      id: crypto.randomUUID(),
      ...request,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const products = this.getProducts();
    this.saveProducts([...products, product])
    return product;
  }
  override update(id: string, request: CreateProductRequest): Product | undefined {
    const products = this.getProducts();
    const existingProduct = products.find((product => product.id === id));

    if (!existingProduct) {
      return undefined;
    }

    const updatedProduct: Product = {
      ...existingProduct,
      ...request,
      id: existingProduct.id,
      createdAt: existingProduct.createdAt,
      updatedAt: new Date(),
    }

    this.saveProducts(
      products.map((product) => product.id === id ? updatedProduct : product)
    );

    return updatedProduct;
  }
  override remove(id: string): boolean {
    const products = this.getProducts();

    const productExists = products.some((product) => product.id === id);

    if (!productExists) {
      return false;
    }

    const remainingProducts = products.filter((product) => product.id !== id);

    this.saveProducts(remainingProducts);
    return true;
  }

  private saveProducts(products: Product[]) {
    this.storage.set(PRODUCT_STORAGE_KEY, products);
  }

}
