import { Component } from '@angular/core';
import { Board } from '../board/board';
import { Compartment } from '../compartment/compartment';

@Component({
  imports: [Board, Compartment],
  selector: 'app-shelf',
  templateUrl: './shelf.html',
})
export class Shelf {}
