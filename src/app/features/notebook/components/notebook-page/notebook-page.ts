import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-notebook-page',
  templateUrl: './notebook-page.html',
})
export class NotebookPage {
  title = input<string>('');
  pageNumber = input<number>(1);

}
