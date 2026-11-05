import { DestroyRef, ElementRef, Signal, afterNextRender, inject, signal } from '@angular/core';

export const bookWidth = 80; 
export const gap = 25;
export const shelves_per_bookcase = 3; 

function splitList<T>(list: T[], size:number): T[][] {
  const out: T[][] = [];

  for (let i = 0; i < list.length; i+= size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

// books in one shelf
export function itemsPerShelf(width: number): number {
    return Math.max(1, Math.floor((width + gap) / (bookWidth + gap)));
}

// books -> shelves -> bookcases
export function paginate<T>(items: T[], perShelf: number, shelvesPerCase = shelves_per_bookcase): T[][][] {
    return splitList(splitList(items, perShelf), shelvesPerCase);
}

export function elementWidth(target: Signal<ElementRef<HTMLElement>>): Signal<number> {
  const destroyRef = inject(DestroyRef);
  const width = signal(0);

  afterNextRender(() => {
    const ro = new ResizeObserver(([entry]) => width.set(entry.contentRect.width));
    ro.observe(target().nativeElement);
    destroyRef.onDestroy(() => ro.disconnect());
  });

  return width.asReadonly();
}