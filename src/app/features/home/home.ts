import { Component } from '@angular/core';
import {NotebookList} from './components/notebook-list/notebook-list';
import { Bookshelf } from '../../shared/ui/bookshelf/bookshelf';

@Component({
  imports: [NotebookList, Bookshelf],
  selector: 'app-home',
  templateUrl: './home.html',
})
export class Home {}
