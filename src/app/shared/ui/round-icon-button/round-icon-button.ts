import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-round-icon-button',
  standalone: true,
  templateUrl: './round-icon-button.html',

})
export class RoundIconButton {
  iconSrc = input.required<string>();
  ariaLabel = input<string>('Voltar');
  clicked = output<void>();
}