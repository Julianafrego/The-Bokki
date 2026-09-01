import { Component } from '@angular/core';
import { BookCard } from './book-card/book-card';
import { Book } from '../../../models/book';

@Component({
  imports: [BookCard],
  selector: 'app-notebook-list',
  styleUrl: './notebook-list.css',
  templateUrl: './notebook-list.html',
})
export class NotebookList {
  books: Book[] = [
    {
      id: 1,
      name: 'my first book',
      coverColor: '#B83232'
    },
    {
      id: 2,
      name: 'my second book',
      coverColor: '#6B7DB3'
    },
    {
      id: 3,
      name: 'my first book',
      coverColor: '#B83232'
    },
    {
      id: 4,
      name: 'my second book',
      coverColor: '#6B7DB3'
    },
    {
      id: 5,
      name: 'my first book',
      coverColor: '#B83232'
    },
    {
      id: 6,
      name: 'my second book',
      coverColor: '#6B7DB3'
    },
    {
      id: 7,
      name: 'my first book',
      coverColor: '#B83232'
    },
    {
      id: 8,
      name: 'my second book',
      coverColor: '#6B7DB3'
    }

  ];
}
