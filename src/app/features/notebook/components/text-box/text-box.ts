import {
  Component,
  OnDestroy,
  OnInit,
  input,
  output,
} from '@angular/core';

import { Editor } from '@tiptap/core';
import type { JSONContent } from '@tiptap/core';

import StarterKit from '@tiptap/starter-kit';
import { TiptapEditorDirective } from 'ngx-tiptap';

import type { TextBoxModel } from '../../../../data/models/text-box.model';

@Component({
  imports: [TiptapEditorDirective],
  selector: 'app-text-box',
  templateUrl: './text-box.html',

  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
    }

    .text-box-selected {
      outline: 1px solid #C19A6B;
      outline-offset: 1px;
    }
  `],
})
export class TextBox implements OnInit, OnDestroy {

  editor!: Editor;

  box = input.required<TextBoxModel>();
  emptyOnBlur = output<void>();

  autoFocus = input(false);
  selected = input(false);

  contentChange = output<JSONContent>();
  contentHeightChange = output<number>();

  private contentResizeObserver?: ResizeObserver;

  private measureFrame: number | null = null;


  ngOnInit(): void {

    this.editor = new Editor({

      extensions: [
        StarterKit,
      ],

      content: this.box().content,

      onCreate: ({ editor }) => {
        if (this.autoFocus()) {
          editor.commands.focus('end');
        }
      },

      onUpdate: ({ editor }) => {
        this.contentChange.emit(editor.getJSON());

        this.scheduleHeightMeasurement();
      },

      onBlur: ({ editor }) => {
        if (editor.isEmpty) {
          this.emptyOnBlur.emit();
        }
      },
    });


    // Observa alterações
    this.contentResizeObserver = new ResizeObserver(() => {
      this.scheduleHeightMeasurement();
    });

    this.contentResizeObserver.observe(this.editor.view.dom);

    //mede o conteúdo inicial
    this.scheduleHeightMeasurement();

  }


  private scheduleHeightMeasurement(): void {

    if (this.measureFrame !== null) {
      return;
    }

    this.measureFrame = requestAnimationFrame(() => {

      this.measureFrame = null;

      if (!this.editor || this.editor.isDestroyed) {
        return;
      }

      const editorElement = this.editor.view.dom;

      const requiredHeight = Math.ceil(
      editorElement.scrollHeight + 8
      );

      this.contentHeightChange.emit(requiredHeight);

    });

  }


  ngOnDestroy(): void {

    this.contentResizeObserver?.disconnect();

    if (this.measureFrame !== null) {
      cancelAnimationFrame(this.measureFrame);
    }

    this.editor?.destroy();
  }

}