import { Component, input } from '@angular/core';
import { Product } from '../../models/product.model';
import { Card } from "../../../../shared/ui/card/card/card";
import { CardHeader } from "../../../../shared/ui/card/card-header/card-header";
import { CardContent } from "../../../../shared/ui/card/card-content/card-content";

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [Card, CardHeader, CardContent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  readonly products = input.required<Product[]>();
}
