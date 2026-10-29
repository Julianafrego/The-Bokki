// shared/components/confirm-dialog/confirm-dialog.ts
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  title = input.required<string>();
  message = input('');
  confirmLabel = input('Confirm');
  cancelLabel = input('Cancel');
  danger = input(false);

  confirm = output<void>();
  cancel = output<void>();
}