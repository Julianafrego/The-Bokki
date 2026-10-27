import { Component } from '@angular/core';
import { Compartment } from './components/compartment/compartment';
import { Board } from './components/board/board';
import { Shelf } from './components/shelf/shelf';
import { WoodBackground } from './components/wood-background/wood-background';

@Component({
  imports: [Compartment, Board, Shelf, WoodBackground],
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.html',
})
export class Bookshelf {}
