import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { NotebookPage } from './components/notebook-page/notebook-page';
import { NotebookCover } from './components/notebook-cover/notebook-cover';
import { SearchBar } from '../../shared/ui/search-bar/search-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NotebookContentRepository } from '../../data/repository/notebook-content.repository';
import type { NotebookPageModel } from '../../data/models/notebook-page.model';
import type { TextBoxModel } from '../../data/models/text-box.model';
import { AngularMarkViewComponent } from 'ngx-tiptap';
import { RoundIconButton } from '../../shared/ui/round-icon-button/round-icon-button';
import { Button } from '../../shared/ui/button/button';

@Component({
  imports: [NotebookPage, NotebookCover, SearchBar, RoundIconButton, AngularMarkViewComponent, Button],
  selector: 'app-notebook',
  templateUrl: './notebook.html',
})
export class Notebook {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  readonly notebookId = signal<number | null>(null);
  
  private contentRepository = inject(NotebookContentRepository);

  private location = inject(Location);

  readonly pages = signal<NotebookPageModel[]>([]);
  readonly textBoxes = signal<TextBoxModel[]>([]);

  notebookcolor = '#AD7947';

  readonly currentPagePosition = signal(1);
  readonly isSpreadMode = signal(window.innerWidth >= 1000);

  readonly visiblePages = computed(() => {
    const pages = this.pages();
    const currentPosition = this.currentPagePosition();

    if (this.isSpreadMode()) {
      const firstPosition = Math.floor((currentPosition - 1) / 2) * 2 + 1;

      return pages.filter(page => 
        page.position === firstPosition ||
        page.position === firstPosition + 1
      );
    }

    return pages.filter(
      page => page.position === currentPosition
    );
  })


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

  backPage(): void {
    this.location.back();
  }

  async nextPage(): Promise<void> {
    const currentPosition = this.currentPagePosition();

    let nextPosition: number;

    if (this.isSpreadMode()) {
      const firstPosition =
        Math.floor((currentPosition - 1) / 2) * 2 + 1;

      nextPosition = firstPosition + 2;
    } else {
      nextPosition = currentPosition + 1;
    }

    await this.ensurePageExists(nextPosition);

    this.currentPagePosition.set(nextPosition);
  }

  previousPage(): void {
    const currentPosition = this.currentPagePosition();

    let previousPosition: number;

    if (this.isSpreadMode()) {
      const firstPosition =
        Math.floor((currentPosition - 1) / 2) * 2 + 1;

      previousPosition = firstPosition - 2;
    } else {
      previousPosition = currentPosition - 1;
    }

    if (previousPosition < 1) return;

    this.currentPagePosition.set(previousPosition);
  }

  private async ensurePageExists(
    targetPosition: number
  ): Promise<void> {
    const notebookId = this.notebookId();

    if (notebookId === null) return;

    const requiredPosition = this.isSpreadMode()
      ? targetPosition + 1
      : targetPosition;

    while (
      this.pages().length === 0 ||
      Math.max(...this.pages().map(page => page.position))
        < requiredPosition
    ) {
      const newPage =
        await this.contentRepository.createPage(notebookId);

      this.pages.update(pages => [...pages, newPage]);
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.isSpreadMode.set(window.innerWidth >= 1000);
  }

  @HostListener('document:keydown', ['$event'])
  
  onKeyboardNavigation(event: KeyboardEvent): void {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    const target = event.target;

    if (target instanceof HTMLElement) {
      const isEditing =
        target.isContentEditable ||
        target.closest(
          'input, textarea, select, [contenteditable="true"]'
        );

      if (isEditing) return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      void this.nextPage();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.previousPage();
    }
  }

  updateTextBoxes(
    pageId: number,
    updatedBoxes: TextBoxModel[]
  ): void {
    this.textBoxes.update(currentBoxes => [
      ...currentBoxes.filter(box => box.pageId !== pageId),
      ...updatedBoxes,
    ]);
  }
}
