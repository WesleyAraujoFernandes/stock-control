import { Component, inject } from '@angular/core';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { Page } from '../../../../shared/ui/page/page';
import { ProductForm } from '../../components/product-form/product-form';
import { Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { ToastService } from '../../../../shared/services/toast.service';

@Component({
  imports: [PageHeader, Page, PageContent, ProductForm],
  templateUrl: './product-create-page.html',
  styleUrl: './product-create-page.css',
})
export class ProductCreatePage {
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  onProductSaved(_product: Product): void {
    this.toastService.success(`Produto "${_product.name}" criado com sucesso`);
    this.router.navigate(['/products']);
  }

  onSaveError(message: string): void {
    this.toastService.error(message);
  }
}
