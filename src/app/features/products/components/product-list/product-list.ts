import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { Card } from '../../../../shared/ui/card/card/card';
import { CardHeader } from '../../../../shared/ui/card/card-header/card-header';
import { CardContent } from '../../../../shared/ui/card/card-content/card-content';
import { CardFooter } from '../../../../shared/ui/card/card-footer/card-footer';
import { Button } from '../../../../shared/ui/button/button/button';
import { ProductStore } from '../../store/product.store';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [Card, CardHeader, CardContent, CurrencyPipe, CardFooter, Button, ConfirmDialog],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private readonly router = inject(Router);
  private readonly productStore = inject(ProductStore);
  private readonly toastService = inject(ToastService);
  readonly products = input.required<Product[]>();
  readonly productToDelete = signal<Product | null>(null);

  stockStatus(product: Product): 'low' | 'normal' {
    return product.quantity <= product.minimumStock ? 'low' : 'normal';
  }

  editProduct(productId: string): void {
    this.router.navigate(['products', productId, 'edit']);
  }

  removeProduct(productId: string): void {
    const product = this.productStore.getById(productId);
    if (!product) return;
    this.productToDelete.set(product);
  }

  cancelDelete(): void {
    this.productToDelete.set(null);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;
    const removed = this.productStore.remove(product.id);
    if (removed) this.toastService.success(`Produto ${product.name} removido com sucesso`);
    this.productToDelete.set(null);
  }
}
