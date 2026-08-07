import { Component, inject } from '@angular/core';
import { PageHeader } from "../../../../shared/ui/page-header/page-header";
import { PageContent } from "../../../../shared/ui/page-content/page-content";
import { CardContent } from "../../../../shared/ui/card/card-content/card-content";
import { CardHeader } from "../../../../shared/ui/card/card-header/card-header";
import { Card } from "../../../../shared/ui/card/card/card";


@Component({
  imports: [PageHeader, PageContent, CardContent, CardHeader, Card],
  templateUrl: './product-create-page.html',
  styleUrl: './product-create-page.css',
})
export class ProductCreatePage {
  private readonly fb = inject(FormBuilder);
}
