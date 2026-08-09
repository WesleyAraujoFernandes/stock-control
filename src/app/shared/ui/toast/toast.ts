import { Component, computed, inject } from '@angular/core';
import { TOAST_BASE_CLASSES, TOAST_VARIANTS_CLASSES } from './toast.styles';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  private toastService = inject(ToastService);

  readonly toast = this.toastService.toast;
  readonly classes = computed(() => {
    const currentToast = this.toast();
    if (!currentToast) return '';

    return [TOAST_BASE_CLASSES, TOAST_VARIANTS_CLASSES[currentToast.type]].join(' ');
  });

  close(): void {
    this.toastService.clear();
  }
}
