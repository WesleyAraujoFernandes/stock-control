import { Observable } from "rxjs";
import { Product } from "../models/product.model";

export type ProductListResult = Observable<Product[]>
export type ProductCreateResult = Observable<Product>
export type ProductUpdateResult = Observable<Product | undefined>
export type ProductRemoveResult = Observable<boolean>
export interface ProductRepositoryTypes {
}
