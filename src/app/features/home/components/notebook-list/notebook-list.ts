import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notebook } from '../notebook/notebook';
import { Notebook as NotebookModel } from '../../../../data/models';
import { NotebookStore } from '../../../../state/notebook.store';

@Component({
  selector: 'app-notebook-list',
  imports: [FormsModule, Notebook],
  templateUrl: './notebook-list.html',
  styleUrl: './notebook-list.css',
})
export class NotebookList implements OnInit {
  store = inject(NotebookStore);

  // form for create and edit
  formOpen = signal(false);
  editing = signal<NotebookModel | null>(null);
  title = signal('');
  description = signal('');
  color = signal('');

  // confirm delete
  deleting = signal<NotebookModel | null>(null);

  ngOnInit() {
    this.store.loadNotebooks();
  }

  openCreate() {
    this.editing.set(null);
    this.title.set('');
    this.description.set('');
    this.color.set('');
    this.formOpen.set(true);
  }

  openEdit(n: NotebookModel) {
    this.editing.set(n);
    this.title.set(n.title);
    this.description.set(n.description || '');
    this.color.set(n.color);
    this.formOpen.set(true);
  }

  async save() {
    const title = this.title().trim();
    if (!title) return;

    const data = {
      title,
      description: this.description().trim(),
      color: this.color(),
    };

    const current = this.editing();
    if (current) {
      await this.store.updateNotebook({ ...current, ...data });
    } else {
      await this.store.createNotebook(data);
    }
    this.formOpen.set(false);
  }

// This method doesn't receive an ID because the selected notebook
// is stored in a signal, so we can get its ID and delete it
  async confirmDelete() {
    const n = this.deleting();
    if (!n) return;
    await this.store.deleteNotebook(n.id);
    this.deleting.set(null);
  }
}