import { Component } from '@angular/core';
import { BookCard } from './book-card/book-card';

@Component({
  imports: [BookCard],
  selector: 'app-notebook-list',
  styleUrl: './notebook-list.css',
  templateUrl: './notebook-list.html',
})
export class NotebookList {}
