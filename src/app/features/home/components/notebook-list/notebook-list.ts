import { Component } from '@angular/core';
import { Notebook } from '../notebook/notebook';
@Component({
  imports: [Notebook],
  selector: 'app-notebook-list',
  styleUrl: './notebook-list.css',
  templateUrl: './notebook-list.html',
})
export class NotebookList {}
