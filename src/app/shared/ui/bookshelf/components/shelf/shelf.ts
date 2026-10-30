import { Component } from '@angular/core';
import { Board } from '../board/board';
import { Compartment } from '../compartment/compartment';
import { ɵEmptyOutletComponent } from '@angular/router';

@Component({
  imports: [Board, Compartment, ɵEmptyOutletComponent],
  selector: 'app-shelf',
  templateUrl: './shelf.html',
})
export class Shelf {}
