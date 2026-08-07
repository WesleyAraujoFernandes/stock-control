import { computed, inject, Injectable, signal } from "@angular/core";
import { Product } from "../models/product.model";
import { ProductService } from "../services/product.service";

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
}
