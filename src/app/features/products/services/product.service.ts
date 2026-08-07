import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  getProducts(): Product[] {
    return [
      {
        id: "1",
        name: "Notebook",
        sku: 'NB001',
        category: "Informática",
        quantity: 12,
        minimumStock: 5,
        unitPrice: 4200,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Mouse',
        sku: 'MS001',
        category: 'Informática',
        quantity: 50,
        minimumStock: 10,
        unitPrice: 89,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
}
