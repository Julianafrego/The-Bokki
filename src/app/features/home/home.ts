import { Component } from '@angular/core';
import {NotebookList} from './components/notebook-list/notebook-list';
import {Sidebar} from './components/sidebar/sidebar';
import {QuickNotes} from './components/quick-notes/quick-notes';

//todo componente precisa ter @component
@Component({
  imports: [NotebookList, Sidebar, QuickNotes],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  //lógica, dinamicidade do ocmonente
}
