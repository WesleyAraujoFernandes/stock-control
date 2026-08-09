import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  type: ToastType;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toast = signal<ToastMessage | null>(null);
  private timeoutId?: ReturnType<typeof setTimeout>;

  show(message: string, type: ToastType = 'info'): void {
    this.toast.set({ type, message });
    this.clearTimeout();
    this.timeoutId = setTimeout(() => this.clear(), 3000);
  }

  clear(): void {
    this.toast.set(null);
    this.clearTimeout();
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  success(message: string): void {
    this.show(message, 'success');
  }

  error(message: string): void {
    this.show(message, 'error');
  }

  warning(message: string): void {
    this.show(message, 'warning');
  }

  info(message: string): void {
    this.show(message, 'info');
  }
}
