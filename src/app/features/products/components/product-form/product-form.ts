import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { Button } from '../../../../shared/ui/button/button/button';
import { ProductStore } from '../../store/product.store';
import { Product } from '../../models/product.model';
import { CreateProductRequest } from '../../models/create-product.request';
import { UpdateProductRequest } from '../../models/update-product.request';

import { ERROR_CLASSES, FORM_FIELD_CLASSES, LABEL_CLASSES } from './product-form.style';

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
  readonly saveError = output<string>();
  readonly cancelled = output<void>();

  readonly initialValue = input<Product | null>(null);
  readonly saving = signal(false);

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
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const product = this.initialValue();

    if (product) {
      this.updateProduct(product);
      return;
    }

    this.createProduct();
  }

  private updateProduct(product: Product): void {
    const request: UpdateProductRequest = this.form.getRawValue();

    this.productStore
      .update(product.id, request)
      .pipe(
        finalize(() => {
          this.saving.set(false);
        })
      )
      .subscribe({
        next: (updatedProduct) => {
          if (!updatedProduct) {
            return;
          }

          this.saved.emit(updatedProduct);
        },
        error: (error) => {
          this.saveError.emit('Não foi possível atualizar o produto: ' + error.message);
        },
      });
  }

  private createProduct(): void {
    const request: CreateProductRequest = this.form.getRawValue();

    this.productStore
      .create(request)
      .pipe(
        finalize(() => {
          this.saving.set(false);
        })
      )
      .subscribe({
        next: (createdProduct) => {
          this.saved.emit(createdProduct);
        },
        error: (error) => {
          this.saveError.emit('Não foi possível criar o produto: ' + error);
        },
      });
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
