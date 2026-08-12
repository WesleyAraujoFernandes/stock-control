import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';

export abstract class ProductRepository {
  abstract getAll(): Product[];
  abstract create(request: CreateProductRequest): Product;
  abstract update(id: string, request: CreateProductRequest): Product | undefined;
  abstract remove(id: string): boolean;
}
