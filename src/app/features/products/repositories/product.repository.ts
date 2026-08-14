import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { CreateProductRequest } from '../models/create-product.request';
import { UpdateProductRequest } from '../models/update-product.request';

export abstract class ProductRepository {
  abstract getById(id: string): Product | undefined;
  abstract getProducts(): Observable<Product[]>;
  abstract create(request: CreateProductRequest): Observable<Product>;
  abstract update(id: string,request: UpdateProductRequest): Observable<Product | undefined>;
  abstract remove(id: string): Observable<boolean>;
}
