import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  templateUrl: './button.html',
})
export class Button {
  label = input.required<string>();

  size = input<'sm' | 'md'>('md');
  variant = input<'primary' | 'secondary' | 'danger' | 'confirm'>('primary');

  fullWidth = input(false);
  Fullheight = input(false);

  disabled = input(false);

  clicked = output<void>();

  iconPosition = input<'left' | 'top'>('left');
}
