import { Component, computed, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notebook as NotebookModel, NewNotebook } from '../../../../data/models';
import { Shelf } from '../../../../shared/ui/bookshelf/components/shelf/shelf';
import { Notebook } from '../notebook/notebook';
import { HotToastService } from '@ngxpert/hot-toast';
import { inject } from '@angular/core';

@Component({
  selector: 'app-notebook-form',
  imports: [FormsModule, Shelf, Notebook],
  templateUrl: './notebook-form.html',
})
export class NotebookForm implements OnInit {
  notebook = input<NotebookModel | null>(null);

  save = output<NewNotebook>();
  cancel = output<void>();

  title = signal('');
  description = signal('');
  color = signal('#c38a52');

  private toast = inject(HotToastService);

  now = new Date();
  previewNotebook = computed<NotebookModel>(() => ({
    id: 0,
    title: this.title() || 'My Bokki',
    description: this.description(),
    color: this.color(),
    createdAt: this.now,
    updatedAt: this.now
  }));

  ngOnInit() {
    const n = this.notebook();
    if (n) {
      this.title.set(n.title);
      this.description.set(n.description || '');
      this.color.set(n.color);
    }
  }

  submit() {
    const title = this.title().trim();

    if (!title) return;

    this.save.emit({
      title,
      description: this.description().trim(),
      color: this.color(),
    });
  }
}