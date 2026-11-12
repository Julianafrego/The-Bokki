import { Component, DestroyRef, inject, OnInit, signal, computed, viewChild, ElementRef, afterNextRender, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notebook } from '../notebook/notebook';
import { NewNotebook, Notebook as NotebookModel } from '../../../../data/models';
import { NotebookStore } from '../../../../state/notebook.store';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { NotebookForm } from '../notebook-form/notebook-form';
import { Shelf } from '../../../../shared/ui/bookshelf/components/shelf/shelf';
import { Bookshelf } from '../../../../shared/ui/bookshelf/bookshelf';
import {
  shelves_per_bookcase, bookWidth, elementWidth, itemsPerShelf, paginate,
} from '../../../../shared/utils/bookshelf-layout';



interface ShelfItem {
  key: String;
  notebook: NotebookModel | null;
}

@Component({
  selector: 'app-notebook-list',
  imports: [FormsModule, Notebook, NotebookForm, ConfirmDialog, Shelf, Bookshelf ],
  templateUrl: './notebook-list.html',
})
export class NotebookList implements OnInit {
  store = inject(NotebookStore);
  private destroyRef = inject(DestroyRef);

  // for dialogs
  formOpen = signal(false);
  editing = signal<NotebookModel | null>(null);
  title = signal('');
  description = signal('');
  color = signal('');

  deleting = signal<NotebookModel | null>(null);


  // for layout 
  private area = viewChild.required<ElementRef<HTMLElement>>('area');
  private width = elementWidth(this.area);
  page = signal(0);


  private items = computed<ShelfItem[]>(() => [
    { key: 'create', notebook: null },
    ...this.store.notebooks().map(n => ({ key: String(n.id), notebook: n })),
  ]);

  private bookcases = computed(() => paginate(this.items(), itemsPerShelf(this.width())));

  totalPages = computed(() => Math.max(1, this.bookcases().length));
  currentPage = computed(() => Math.min(this.page(), this.totalPages() - 1));

  // always returns the same number of shelves
  shelves = computed(() => {
    const rows = this.bookcases()[this.currentPage()] ?? [];
    return Array.from({ length: shelves_per_bookcase }, (_, i) => rows[i] ?? []);
  });


  
  ngOnInit() {
    this.store.loadNotebooks();
  }

  // ---- navigation ----
  prev() { this.page.set(Math.max(0, this.currentPage() - 1)); }
  next() { this.page.set(Math.min(this.totalPages() - 1, this.currentPage() + 1)); }

  // ---- actions ----
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
    const ok = current
      ? await this.store.updateNotebook({ ...current, ...data })
      : await this.store.createNotebook(data);

    if (ok) this.formOpen.set(false);
  }

  requestDelete() {
    const notebook = this.editing();
    if (!notebook) return;

    this.deleting.set(notebook);
  }

  async confirmDelete() {
    const n = this.deleting();
    if (!n) return;

    const ok = await this.store.deleteNotebook(n.id);
    
    if (ok) {
      this.deleting.set(null);
      this.formOpen.set(false);
      this.editing.set(null);
    }
  }
}