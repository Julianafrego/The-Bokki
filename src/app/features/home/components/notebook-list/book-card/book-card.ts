import { Component, input } from '@angular/core';
import { Book } from '../../../../models/book';

@Component({
  imports: [],
  selector: 'app-book-card',
  styleUrl: './book-card.css',
  templateUrl: './book-card.html',
})
export class BookCard {
  book = input.required<Book>();

  get spineColor(): string {
    return this.darkenColor(this.book().coverColor, 15);
  }

  private darkenColor(hex: string, amount: number): string{
      // O 16 força a conversão de hexadecimal para número decimal (Base 10).
    const num = parseInt(hex.replace("#", ""), 16);

    // const r calculates the red value of the color in the range 0-255.
    const r = Math.max(0, (num >> 16) - amount);
    // const g calculates the green value of the color in the range 0-255.
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    // const b calculates the blue value of the color in the range 0-255.
    const b = Math.max(0, (num & 0xff) - amount);

    return `rgb(${r}, ${g}, ${b})`;
  }
}

