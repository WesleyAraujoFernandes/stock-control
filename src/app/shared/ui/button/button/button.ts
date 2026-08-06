import { computed, Component, input } from '@angular/core';

import {
  BUTTON_BASE_CLASSES,
  BUTTON_SIZES_CLASSES,
  BUTTON_VARIANTS_CLASSES
} from './button.styles';

import {
  ButtonSize,
  ButtonVariant
} from './button.types';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css'
})
export class Button {

  readonly variant = input<ButtonVariant>('primary');

  readonly size = input<ButtonSize>('md');

  readonly disabled = input(false);

  readonly classes = computed(() => {

    const disabledClasses = this.disabled()
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer';

    return [
      BUTTON_BASE_CLASSES,
      BUTTON_VARIANTS_CLASSES[this.variant()],
      BUTTON_SIZES_CLASSES[this.size()],
      disabledClasses
    ].join(' ');
  });

}
