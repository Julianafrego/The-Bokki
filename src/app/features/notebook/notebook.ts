import { Component } from '@angular/core';
import { NotebookPage } from './components/notebook-page/notebook-page';
import { NotebookCover } from './components/notebook-cover/notebook-cover';

@Component({
  imports: [NotebookPage, NotebookCover],
  selector: 'app-notebook',
  templateUrl: './notebook.html',
})
export class Notebook {
  notebookcolor = '#AD7947';
}
