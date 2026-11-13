import { Component } from '@angular/core';
import { NotebookPage } from './components/notebook-page/notebook-page';
import { NotebookCover } from './components/notebook-cover/notebook-cover';
import { SearchBar } from '../../shared/ui/search-bar/search-bar';

@Component({
  imports: [NotebookPage, NotebookCover, SearchBar],
  selector: 'app-notebook',
  templateUrl: './notebook.html',
})
export class Notebook {
  notebookcolor = '#AD7947';
}
