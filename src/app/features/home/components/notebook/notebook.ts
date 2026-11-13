import { Component, input, output, EventEmitter } from '@angular/core';
import { Notebook as NotebookModel } from '../../../../data/models/Notebook.model';
import { Button } from '../../../../shared/ui/button/button';

@Component({
  imports: [Button],
  selector: 'app-notebook',
  templateUrl: './notebook.html',
})
export class Notebook {
  name = 'Notebook';
  imglombada = "/assets/spine-book/rose-spine.png";

  notebook = input.required<NotebookModel>();
  edit = output<NotebookModel>();
  remove = output<NotebookModel>();

  previewOnly = input(false);
  compact = input(false);
}
