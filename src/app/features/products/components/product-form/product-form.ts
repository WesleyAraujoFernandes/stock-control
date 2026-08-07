import { CreateProductRequest } from './../../models/create-product.request';
import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button/button';
import { ERROR_CLASSES, FORM_FIELD_CLASSES, LABEL_CLASSES } from './product-form.style';
import { ProductStore } from '../../store/product.store';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [
    ReactiveFormsModule,
    Button
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  private readonly productStore = inject(ProductStore)
  private readonly fb = inject(FormBuilder);
  readonly fieldClasses = FORM_FIELD_CLASSES;
  readonly labelClasses = LABEL_CLASSES;
  readonly errorClasses = ERROR_CLASSES;
  readonly saved = output<Product>();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    sku: ['', [Validators.required, Validators.maxLength(30)]],
    category: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(0)]],
    minimumStock: [1, [Validators.required, Validators.min(0)]],
    unitPrice: [0, [Validators.required, Validators.min(0)]],
    active: [true, [Validators.required]],
    createdAt: [new Date(), [Validators.required]],
    updatedAt: [new Date(), [Validators.required]]
  })

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: CreateProductRequest = this.form.getRawValue();
    const product = this.productStore.create(request);
    this.saved.emit(product);
    console.log('Produto criado:', product);
  }
}
