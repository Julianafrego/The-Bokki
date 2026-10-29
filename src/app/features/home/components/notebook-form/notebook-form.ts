import { Component, input, output, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Notebook as NotebookModel, NewNotebook } from '../../../../data/models';

@Component({
  selector: 'app-notebook-form',
  imports: [FormsModule],
  templateUrl: './notebook-form.html',
})
export class NotebookForm implements OnInit {
  notebook = input<NotebookModel | null>(null);

  save = output<NewNotebook>();
  cancel = output<void>();

  title = signal('');
  description = signal('');
  color = signal('#c38a52');

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