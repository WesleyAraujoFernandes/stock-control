import { computed, inject, Injectable, signal } from "@angular/core";
import { Product } from "../models/product.model";
import { ProductService } from "../services/product.service";
import { CreateProductRequest } from "../models/create-product.request";

@Injectable({
  providedIn: "root",
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
    this.products.set(this.productService.getProducts());
  }

  create(request: CreateProductRequest): Product {
    const product = this.productService.create(request);
    this.products.update(products => [...products, product]);
    return product;
  }
}
