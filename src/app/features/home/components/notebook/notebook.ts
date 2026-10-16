import { Component, input, output, EventEmitter } from '@angular/core';
import { Notebook as NotebookModel } from '../../../../data/models';
@Component({
  imports: [],
  selector: 'app-notebook',
  styleUrl: './notebook.css',
  templateUrl: './notebook.html',
})
export class Notebook {
  name = 'Notebook';
  imglombada = "/assets/spine-book/rose-spine.png";

  notebook = input.required<NotebookModel>();
  edit = output<NotebookModel>();
  remove = output<NotebookModel>();
}
