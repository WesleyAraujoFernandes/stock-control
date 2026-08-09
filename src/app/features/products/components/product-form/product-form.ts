import { CreateProductRequest } from './../../models/create-product.request';
import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button/button';
import { ERROR_CLASSES, FORM_FIELD_CLASSES, LABEL_CLASSES } from './product-form.style';
import { ProductStore } from '../../store/product.store';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, Button],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm {
  private readonly productStore = inject(ProductStore);
  private readonly fb = inject(FormBuilder);
  readonly fieldClasses = FORM_FIELD_CLASSES;
  readonly labelClasses = LABEL_CLASSES;
  readonly errorClasses = ERROR_CLASSES;
  readonly saved = output<Product>();
  readonly initialValue = input<Product | null>(null);
  readonly saveError = output<string>();

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    sku: ['', [Validators.required, Validators.maxLength(30)]],
    category: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(0)]],
    minimumStock: [1, [Validators.required, Validators.min(0)]],
    unitPrice: [10, [Validators.required, Validators.min(0)]],
    active: [true, [Validators.required]],
    createdAt: [new Date(), [Validators.required]],
    updatedAt: [new Date(), [Validators.required]],
  });

  private readonly initializeForm = effect(() => {
    const product = this.initialValue();
    if (!product) {
      return;
    }

    this.form.patchValue({
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.quantity,
      minimumStock: product.minimumStock,
      unitPrice: product.unitPrice,
      active: product.active,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request: CreateProductRequest = this.form.getRawValue();
    const product = this.initialValue();
    if (product) {
      const updatedProduct = this.productStore.update(product.id, request);
      if (updatedProduct) {
        this.saved.emit(updatedProduct);
      } else {
        this.saveError.emit('Não foi possível atualizar o produto');
      }
      return;
    }
    const createdProduct = this.productStore.create(request);
    this.saved.emit(createdProduct);
  }
}
