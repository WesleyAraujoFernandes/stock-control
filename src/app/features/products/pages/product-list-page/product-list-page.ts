import { Component, inject } from '@angular/core';
import { Page } from '../../../../shared/ui/page/page';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { PageContent } from '../../../../shared/ui/page-content/page-content';
import { Card } from '../../../../shared/ui/card/card/card';
import { CardHeader } from '../../../../shared/ui/card/card-header/card-header';
import { CardContent } from '../../../../shared/ui/card/card-content/card-content';
import { Button } from '../../../../shared/ui/button/button/button';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { ProductStore } from '../../store/product.store';
import { ProductList } from "../../components/product-list/product-list";
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list-page',
  imports: [Page, PageHeader, PageContent, Card, CardHeader, CardContent, Button, EmptyState, ProductList],
  templateUrl: './product-list-page.html',
  styleUrl: './product-list-page.css',
})
export class ProductListPage {
  private readonly router = inject(Router);
  constructor(readonly store: ProductStore) { }

  newProduct(): void {
    this.router.navigate(['products/new']);
  }
}

