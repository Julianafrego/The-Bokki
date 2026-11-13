import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-notebook-cover',
  templateUrl: './notebook-cover.html',
})
export class NotebookCover {
  coverColor = input<string>('#AD7947');
}
