import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notebook } from '../notebook/notebook';
import { NewNotebook, Notebook as NotebookModel } from '../../../../data/models';
import { NotebookStore } from '../../../../state/notebook.store';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { NotebookForm } from '../notebook-form/notebook-form';

@Component({
  selector: 'app-notebook-list',
  imports: [FormsModule, Notebook, NotebookForm, ConfirmDialog],
  templateUrl: './notebook-list.html',
})
export class NotebookList implements OnInit {
  store = inject(NotebookStore);

  // for create and edit
  formOpen = signal(false);
  editing = signal<NotebookModel | null>(null);
  title = signal('');
  description = signal('');
  color = signal('');

  deleting = signal<NotebookModel | null>(null);

  ngOnInit() {
    this.store.loadNotebooks();
  }

  openCreate() {
    this.editing.set(null);
    this.formOpen.set(true);
  }

  openEdit(n: NotebookModel) {
    this.editing.set(n);
    this.formOpen.set(true);
  }

  async save(data: NewNotebook) {
    const current = this.editing();
    if (current) {
      await this.store.updateNotebook({ ...current, ...data });
    } else {
      await this.store.createNotebook(data);
    }
    this.formOpen.set(false);
  }

  async confirmDelete() {
    const n = this.deleting();
    if (!n) return;
    await this.store.deleteNotebook(n.id);
    this.deleting.set(null);
  }
}