import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { Card } from '../../../../shared/ui/card/card/card';
import { CardHeader } from '../../../../shared/ui/card/card-header/card-header';
import { CardContent } from '../../../../shared/ui/card/card-content/card-content';
import { CardFooter } from '../../../../shared/ui/card/card-footer/card-footer';
import { Button } from '../../../../shared/ui/button/button/button';
import { ProductStore } from '../../store/product.store';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [Card, CardHeader, CardContent, CurrencyPipe, CardFooter, Button],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private readonly router = inject(Router);
  private readonly productStore = inject(ProductStore);
  readonly products = input.required<Product[]>();

  stockStatus(product: Product): 'low' | 'normal' {
    return product.quantity <= product.minimumStock ? 'low' : 'normal';
  }

  editProduct(productId: string): void {
    this.router.navigate(['products', productId, 'edit']);
  }

  removeProduct(productId: string): void {
    const product = this.productStore.getById(productId);
    if (!product) return;
    const confirmed = confirm(`Tem certeza que deseja remover o produto ${product.name}?`);
    if (!confirmed) return;
    this.productStore.remove(productId);
  }
}
