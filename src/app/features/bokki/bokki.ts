import { Component, EventEmitter, Output } from '@angular/core';
import { BookArea } from './components/book-area/book-area';
import { Toolbar } from './components/toolbar/toolbar';
import { Topbar } from './components/topbar/topbar';

@Component({
  imports: [Topbar, BookArea, Toolbar],
  selector: 'app-bokki',
  styleUrl: './bokki.css',
  templateUrl: './bokki.html',
})
export class Bokki {
  @Output() back = new EventEmitter<void>();
}
