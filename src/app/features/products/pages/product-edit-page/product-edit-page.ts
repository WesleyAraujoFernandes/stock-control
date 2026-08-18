import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardContent } from '../../../../shared/ui/card/card-content/card-content';
import { Page } from '../../../../shared/ui/page/page';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { ProductStore } from '../../store/product.store';
import { ProductForm } from '../../components/product-form/product-form';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { Card } from '../../../../shared/ui/card/card/card';
import { Product } from '../../models/product.model';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { Button } from '../../../../shared/ui/button/button/button';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  selector: 'app-product-edit-page',
  imports: [CardContent, Page, PageHeader, ProductForm, PageContent, Card, EmptyState, Button],
  templateUrl: './product-edit-page.html',
  styleUrl: './product-edit-page.css',
})
export class ProductEditPage {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(ProductStore);
  private readonly toastService = inject(ToastService);

  readonly productId = this.route.snapshot.paramMap.get('id');

  readonly product = this.productId ? this.store.getById(this.productId) : undefined;

  onProductSaved(_product: Product): void {
    this.toastService.success(`Produto "${_product.name}" atualizado com sucesso`);
    this.router.navigate(['/products']);
  }

  onSaveError(error: string): void {
    this.toastService.error(error);
  }

  backToProducts(): void {
    this.router.navigate(['/products']);
  }
}
