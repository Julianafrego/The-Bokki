import { Component, inject, signal } from '@angular/core';
import { NotebookPage } from './components/notebook-page/notebook-page';
import { NotebookCover } from './components/notebook-cover/notebook-cover';
import { SearchBar } from '../../shared/ui/search-bar/search-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NotebookContentRepository } from '../../data/repository/notebook-content.repository';
import type { NotebookPageModel } from '../../data/models/notebook-page.model';
import type { TextBoxModel } from '../../data/models/text-box.model';

@Component({
  imports: [NotebookPage, NotebookCover, SearchBar],
  selector: 'app-notebook',
  templateUrl: './notebook.html',
})
export class Notebook {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  readonly notebookId = signal<number | null>(null);
  
  private contentRepository = inject(NotebookContentRepository);

  readonly pages = signal<NotebookPageModel[]>([]);
  readonly textBoxes = signal<TextBoxModel[]>([]);

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

    void this.loadNotebookContent(id);
  }

  private async loadNotebookContent(notebookId: number): Promise<void> {
    try {
      await this.contentRepository.ensureInitialPages(notebookId);

      const content = await this.contentRepository.getNotebookContent(notebookId);

      this.pages.set(content.pages);
      this.textBoxes.set(content.textBoxes);
    } catch (error) {
      console.error('Could not load notebook content: ', error);
    }
  }

  getTextBoxesForPage(pageId: number): TextBoxModel[] {
    return this.textBoxes().filter(box => box.pageId == pageId);
  }
}
