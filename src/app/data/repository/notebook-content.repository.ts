import { NotebookContentModel } from '../models/notebook-content.model';
import { NotebookPageModel } from '../models/notebook-page.model';
import type { TextBoxModel } from '../models/text-box.model';

export abstract class NotebookContentRepository {

  abstract ensureInitialPages(notebookId: number): Promise<void>;

  abstract getNotebookContent(
    notebookId: number
  ): Promise<NotebookContentModel>;

  abstract saveTextBox(box: TextBoxModel): Promise<void>;

  abstract deleteTextBox(id: string): Promise<void>;

  abstract createPage(notebookId: number): Promise<NotebookPageModel>;
}