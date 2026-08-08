import { Component, input, output } from '@angular/core';
import { Button } from '../button/button/button';
import {
  DIALOG_ACTIONS_CLASSES,
  DIALOG_CLASSES,
  DIALOG_MESSAGE_CLASSES,
  DIALOG_OVERLAY_CLASSES,
  DIALOG_TITLE_CLASSES,
} from './confirm-dialog.styles';

@Component({
  selector: 'app-confirm-dialog',
  imports: [Button],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  readonly title = input('Confirmar ação');
  readonly message = input.required<string>();

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();

  readonly overlayClasses = DIALOG_OVERLAY_CLASSES;
  readonly dialogClasses = DIALOG_CLASSES;
  readonly titleClasses = DIALOG_TITLE_CLASSES;
  readonly messageClasses = DIALOG_MESSAGE_CLASSES;
  readonly actionsClasses = DIALOG_ACTIONS_CLASSES;

  confirm(): void {
    this.confirmed.emit();
  }

  cancel(): void {
    this.cancelled.emit();
  }
}
