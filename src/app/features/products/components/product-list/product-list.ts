import { Component, computed, inject, input, signal } from '@angular/core';
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
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

type ProductFilter = 'all' | 'active' | 'inactive';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [Card, CardHeader, CardContent, CurrencyPipe, CardFooter, Button, ConfirmDialog, EmptyState],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private readonly router = inject(Router);
  private readonly productStore = inject(ProductStore);
  private readonly toastService = inject(ToastService);
  readonly products = input.required<Product[]>();
  readonly productToDelete = signal<Product | null>(null);
  readonly filter = signal<ProductFilter>('all');
  readonly hasFilteredProducts = computed(() => this.filteredProducts().length > 0);
  readonly totalActiveProduct = computed(() => this.products().filter(product => product.active).length);
  readonly totalInactiveProduct = computed(() => this.products().filter(product => !product.active).length);
  readonly totalProducts = computed(() => this.products().length);
  readonly searchTerm = signal('');
  readonly hasSearchTerm = computed(() => this.searchTerm().trim().length > 0);

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

  toggleActive(productId: string): void {
    const product = this.productStore.getById(productId);
    if (!product) return;
    const updated = this.productStore.toggleActive(productId);
    if (!updated) {
      this.toastService.error(`Nao foi possivel atualizar o produto ${product.name}`);
      return;
    }
    const status = !product.active ? 'ativado' : 'desativado';
    this.toastService.success(`Produto "${product.name}" ${status} com sucesso`);
  }

  cancelDelete(): void {
    this.productToDelete.set(null);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (!product) return;

    const removed = this.productStore.remove(product.id);
    if (removed) {
      this.toastService.success(`Produto ${product.name} exlcuído com sucesso`);
    } else {
      this.toastService.error(`Não foi possível excluir o produto ${product.name}`);
    }
    this.productToDelete.set(null); // fechar modal
  }

  readonly filteredProducts = computed(() => {
    const products = this.products();
    const filter = this.filter();
    const searchTerm = this.searchTerm().trim().toLowerCase();
    return products.filter(product => {
      const matchesFilter = filter === 'all' || (filter === 'active' && product.active) || (filter === 'inactive' && !product.active);
      const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm) || product.sku.toLowerCase().includes(searchTerm);
      return matchesFilter && matchesSearch;
    })
  });

  setFilter(filter: ProductFilter): void {
    this.filter.set(filter);
  }

  getStockStatus(product: Product): 'sufficient' | 'low' {
    return product.quantity <= product.minimumStock ? 'low' : 'sufficient';
  }

  clearSearch(): void {
    this.searchTerm.set('');
  }

}
