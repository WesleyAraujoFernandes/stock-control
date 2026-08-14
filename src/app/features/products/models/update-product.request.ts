export interface UpdateProductRequest {
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
  active: boolean;
}
