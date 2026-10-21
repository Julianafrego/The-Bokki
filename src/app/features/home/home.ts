import { Component } from '@angular/core';
import {NotebookList} from './components/notebook-list/notebook-list';

@Component({
  imports: [NotebookList],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
