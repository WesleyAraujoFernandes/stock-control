import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../../../../shared/ui/button/button/button';
import { ERROR_CLASSES, FORM_FIELD_CLASSES, LABEL_CLASSES } from './product-form.style';

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
  private readonly fb = inject(FormBuilder);
  readonly fieldClasses = FORM_FIELD_CLASSES;
  readonly labelClasses = LABEL_CLASSES;
  readonly errorClasses = ERROR_CLASSES;

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(120)]],
    sku: ['', [Validators.required, Validators.maxLength(30)]],
    category: ['', [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(0)]],
    minimumStock: [1, [Validators.required, Validators.min(0)]],
  })

  save(): void {
    console.log(this.form.getRawValue());
  }
}
