import { Component } from '@angular/core';
import { Compartment } from './compartment/compartment';

@Component({
  imports: [Compartment],
  selector: 'app-bookshelf',
  templateUrl: './bookshelf.html',
})
export class Bookshelf {}
