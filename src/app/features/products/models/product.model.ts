export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;

}
