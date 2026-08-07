export interface UpdateProductRequest {
  id: number;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
}
