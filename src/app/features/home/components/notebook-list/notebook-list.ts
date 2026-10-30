import { Component, DestroyRef, inject, OnInit, signal, computed, viewChild, ElementRef, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notebook } from '../notebook/notebook';
import { NewNotebook, Notebook as NotebookModel } from '../../../../data/models';
import { NotebookStore } from '../../../../state/notebook.store';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { NotebookForm } from '../notebook-form/notebook-form';
import { Shelf } from '../../../../shared/ui/bookshelf/components/shelf/shelf';
import { Bookshelf } from '../../../../shared/ui/bookshelf/bookshelf';

const BookWidth = 80; 
const gap = 25;
const shelves_per_bookcase = 3; 

interface ShelfItem {
  key: String;
  notebook: NotebookModel | null;
}

function splitList<T>(list: T[], size:number): T[][] {
  const out: T[][] = [];

  for (let i = 0; i < list.length; i+= size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

@Component({
  selector: 'app-notebook-list',
  imports: [FormsModule, Notebook, NotebookForm, ConfirmDialog, Shelf, Bookshelf ],
  templateUrl: './notebook-list.html',
})
export class NotebookList implements OnInit {
  store = inject(NotebookStore);
  private destroyRef = inject(DestroyRef);

  // for create and edit
  formOpen = signal(false);
  editing = signal<NotebookModel | null>(null);
  title = signal('');
  description = signal('');
  color = signal('');

  deleting = signal<NotebookModel | null>(null);


  // for layout 
  private area = viewChild.required<ElementRef<HTMLElement>>('area');
  private width = signal(0);
  page = signal(0);

  // for actions, open, editing, delete, etc
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

  // for layout and popularize

  private splitPerShef = computed(() =>
    Math.max(1, Math.floor(this.width() + gap) / (BookWidth + gap))
  )

  private items = computed<ShelfItem[]>(() => [
    {key: 'create', notebook: null },
    ...this.store.notebooks().map(n => ({key: String(n.id), notebook: n})),
  ]);

  //organize items in bookshelves and bookshelves group
  private cases = computed(() => splitList(splitList(this.items(), this.splitPerShef()), shelves_per_bookcase));

  totalPages = computed(() => Math.max(1, this.cases().length));
  currentPage = computed(() => Math.min(this.page(), this.totalPages() -1));

  // prepares the visual structure of the bookshelf, same numbers of lines
  shelves = computed(() => {
    const rows = this.cases()[this.currentPage()] ?? [];
    return Array.from({ length: shelves_per_bookcase }, (_, i) => rows[i] ?? []);
  })

  // responsive adaptation of the bookshelf layout
  constructor() {
    afterNextRender(() => {
      const ro = new ResizeObserver(([entry]) => this.width.set(entry.contentRect.width));
      ro.observe(this.area().nativeElement);
      this.destroyRef.onDestroy(() => ro.disconnect());
    });
  }

  prev() {
     this.page.set(Math.max(0, this.currentPage() - 1)); 
  }
  next() {
     this.page.set(Math.min(this.totalPages() - 1, this.currentPage() + 1)); 
  }
}
