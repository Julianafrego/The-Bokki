import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-bokki',
  styleUrl: './bokki.css',
  templateUrl: './bokki.html',
})
export class Bokki {
  @Output() back = new EventEmitter<void>();
}
