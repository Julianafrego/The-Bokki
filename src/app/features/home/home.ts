import { Component } from '@angular/core';
import {Sidebar} from '../../shared/components/sidebar/sidebar';
import {NotebookList} from './components/notebook-list/notebook-list';

@Component({
  imports: [Sidebar, NotebookList],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
