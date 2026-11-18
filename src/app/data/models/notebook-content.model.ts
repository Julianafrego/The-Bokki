import type { NotebookPageModel } from './notebook-page.model';
import type { TextBoxModel } from './text-box.model';

export interface NotebookContentModel {
  pages: NotebookPageModel[];
  textBoxes: TextBoxModel[];
}