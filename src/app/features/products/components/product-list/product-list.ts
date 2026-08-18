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
import { ApiError } from '../../../../core/errors/api-error';

type ProductFilter = 'all' | 'active' | 'inactive';
type ProductSort =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'quantity-asc'
  | 'quantity-desc';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    Card,
    CardHeader,
    CardContent,
    CurrencyPipe,
    CardFooter,
    Button,
    ConfirmDialog,
    EmptyState,
  ],
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
  readonly totalActiveProduct = computed(
    () => this.products().filter((product) => product.active).length
  );
  readonly totalInactiveProduct = computed(
    () => this.products().filter((product) => !product.active).length
  );
  readonly totalProducts = computed(() => this.products().length);
  readonly searchTerm = signal('');
  readonly hasSearchTerm = computed(() => this.searchTerm().trim().length > 0);
  readonly sort = signal<ProductSort>('name-asc');
  readonly deleting = signal(false);

  editProduct(productId: string): void {
    this.router.navigate(['products', productId, 'edit']);
  }

  removeProduct(productId: string): void {
    const product = this.productStore.getById(productId);
    if (!product) return;
    this.productToDelete.set(product);
  }

  toggleActive(productId: string): void {
    this.productStore.toggleActive(productId).subscribe({
      next: (updatedProduct) => {
        if (!updatedProduct) {
          return;
        }

        const status = updatedProduct.active ? 'ativado' : 'desativado';

        this.toastService.success(`Produto "${updatedProduct.name}" ${status} com sucesso.`);
      },

      error: (error: ApiError) => {
        this.toastService.error(error.message);
      },
    });
  }

  cancelDelete(): void {
    if (this.deleting()) {
      return;
    }
    this.productToDelete.set(null);
  }

  confirmDelete(): void {
    const product = this.productToDelete();

    if (!product) {
      return;
    }

    this.productStore.remove(product.id).subscribe({
      next: () => {
        this.productToDelete.set(null);

        this.toastService.success(
          `Produto "${product.name}" excluído com sucesso.`
        );
      },

      error: (error: ApiError) => {
        this.toastService.error(
          error.message
        );
      },
    });
  }

  readonly filteredProducts = computed(() => {
    const products = this.products();
    const filter = this.filter();
    const searchTerm = this.searchTerm().trim().toLowerCase();
    const sort = this.sort();

    const filtered = products.filter((product) => {
      const matchesFilters =
        filter === 'all' ||
        (filter === 'active' && product.active) ||
        (filter === 'inactive' && !product.active);
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm);
      return matchesFilters && matchesSearch;
    });

    const sorted = filtered.sort((a, b) => {
      if (sort === 'name-asc') return a.name.localeCompare(b.name);
      if (sort === 'name-desc') return b.name.localeCompare(a.name);
      if (sort === 'price-asc') return a.unitPrice - b.unitPrice;
      if (sort === 'price-desc') return b.unitPrice - a.unitPrice;
      if (sort === 'quantity-asc') return a.quantity - b.quantity;
      if (sort === 'quantity-desc') return b.quantity - a.quantity;
      return 0;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return a.unitPrice - b.unitPrice;
        case 'price-desc':
          return b.unitPrice - a.unitPrice;
        case 'quantity-asc':
          return a.quantity - b.quantity;
        case 'quantity-desc':
          return b.quantity - a.quantity;
        default:
          return 0;
      }
    });
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

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }
}
