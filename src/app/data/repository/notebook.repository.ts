import { Notebook, NewNotebook } from '../models/Notebook.model';

export abstract class NotebookRepository {
  abstract getAllNotebooks(): Promise<Notebook[]>;
  abstract getNotebookById(id: number): Promise<Notebook | null>;
  abstract createNotebook(data: NewNotebook): Promise<Notebook>;
  abstract updateNotebook(notebook: Notebook): Promise<Notebook>;
  abstract deleteNotebook(id: number): Promise<void>;
}