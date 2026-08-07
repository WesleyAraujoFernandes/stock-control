export interface CreateProductRequest {
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
}
