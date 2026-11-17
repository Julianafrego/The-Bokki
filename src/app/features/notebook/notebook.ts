import { Component, inject, signal } from '@angular/core';
import { NotebookPage } from './components/notebook-page/notebook-page';
import { NotebookCover } from './components/notebook-cover/notebook-cover';
import { SearchBar } from '../../shared/ui/search-bar/search-bar';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  imports: [NotebookPage, NotebookCover, SearchBar],
  selector: 'app-notebook',
  templateUrl: './notebook.html',
})
export class Notebook {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  readonly notebookId = signal<number | null>(null);
  
  notebookcolor = '#AD7947';

  ngOnInit(): void {
    const rawId = this.route.snapshot.paramMap.get('id');
    const id = Number(rawId);

    if (
      rawId == null ||
      !Number.isSafeInteger(id) ||
      id <= 0
    ) {
      void this.router.navigateByUrl('/');
      return;
    }
    this.notebookId.set(id);
  }
}
