import {
  Component,
  ElementRef,
  input,
  signal,
  viewChild,
} from '@angular/core';

import type { JSONContent } from '@tiptap/core';

import { TextBox } from '../text-box/text-box';
import type { TextBoxModel } from '../../../../data/models/text-box.model';

type ResizeDirection =
  | 'left'
  | 'right'
  | 'top'
  | 'bottom'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

interface PointerSession {
  mode: 'move' | 'resize';
  id: string;
  pointerId: number;

  startClientX: number;
  startClientY: number;

  startX: number;
  startY: number;
  startWidth: number;
  startHeight: number;

  direction?: ResizeDirection;
}

@Component({
  imports: [TextBox],
  selector: 'app-notebook-page',
  templateUrl: './notebook-page.html',

  styles: [`
    :host {
      display: block;
      min-width: 0;
    }

    .page-canvas {
      position: relative;
      height: 650px;
      min-height: 650px;
      width: 100%;
      overflow: auto;
      overscroll-behavior: contain;
      isolation: isolate;
    }

    .resize-hit-area {
      position: absolute;
      z-index: 30;
      display: block;
      padding: 0;
      border: 0;
      background: transparent;
      touch-action: none;
      user-select: none;
    }

    .resize-hit-area:hover {
      background: rgba(181, 138, 88, 0.18);
    }

    /* borders */
    .resize-top,
    .resize-bottom {
      left: 10px;
      right: 10px;
      height: 10px;
      cursor: ns-resize;
    }

    .resize-top {
      top: -5px;
    }

    .resize-bottom {
      bottom: -5px;
    }

    .resize-left,
    .resize-right {
      top: 10px;
      bottom: 10px;
      width: 10px;
      cursor: ew-resize;
    }

    .resize-left {
      left: -5px;
    }

    .resize-right {
      right: -5px;
    }

    /* corners */
    .resize-corner {
      width: 14px;
      height: 14px;
      border-radius: 4px;
      background: #B58A58;
      cursor: nwse-resize;
    }

    .resize-top-left {
      top: -7px;
      left: -7px;
    }

    .resize-top-right {
      top: -7px;
      right: -7px;
      cursor: nesw-resize;
    }

    .resize-bottom-left {
      bottom: -7px;
      left: -7px;
      cursor: nesw-resize;
    }

    .resize-bottom-right {
      bottom: -7px;
      right: -7px;
    }

    /* move control*/
    .move-handle {
      position: absolute;
      z-index: 40;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      width: 42px;
      height: 16px;
      padding: 0;
      border: 0;
      border-radius: 5px;
      background: #B58A58;
      color: white;
      font-size: 12px;
      line-height: 1;
      cursor: grab;
      touch-action: none;
      user-select: none;
    }

    .move-handle:active {
      cursor: grabbing;
    }
  `],
})
export class NotebookPage {

  title = input<string>('');
  pageNumber = input<number>(1);

  readonly canvas =
    viewChild.required<ElementRef<HTMLDivElement>>('canvas');

  textBoxes = signal<TextBoxModel[]>([]);

  activeTextBoxId = signal<string | null>(null);

  // Altura medida pelo tiptap
  contentHeights = signal<Record<string, number>>({});

  private pointerSession: PointerSession | null = null;

  private readonly minWidth = 140;
  private readonly minHeight = 80;


  // create new box
  createTextBoxAt(event: MouseEvent): void {
    const element = this.canvas().nativeElement;
    const rect = element.getBoundingClientRect();

    const id = crypto.randomUUID();

    const newBox: TextBoxModel = {
      id,

      x: event.clientX - rect.left + element.scrollLeft,
      y: event.clientY - rect.top + element.scrollTop,

      width: 300,
      height: this.minHeight,

      content: {
        type: 'doc',
        content: [
          { type: 'paragraph' }
        ]
      }
    };

    this.textBoxes.update(boxes => [...boxes, newBox]);

    this.activeTextBoxId.set(id);
  }


  selectTextBox(id: string, event: MouseEvent): void {
    event.stopPropagation();

    this.activeTextBoxId.set(id);
  }


  updateTextBoxContent(id: string, content: JSONContent): void {
    this.textBoxes.update(boxes =>
      boxes.map(box =>
        box.id === id ? { ...box, content } : box
      )
    );
  }


  // receive height from tiptap
  updateContentHeight(id: string, requiredHeight: number): void {
    const height = Math.max(
      this.minHeight,
      Math.ceil(requiredHeight)
    );

    this.contentHeights.update(current => {

      if (Math.abs((current[id] ?? 0) - height) < 2) {
        return current;
      }

      return {
        ...current,
        [id]: height,
      };
    });
  }


  // height to display
  getDisplayedHeight(box: TextBoxModel): number {
    return Math.max(
      box.height,
      this.contentHeights()[box.id] ?? this.minHeight
    );
  }


  // capture pointer to ensure we receive all events during drag
  private capturePointer(event: PointerEvent): void {
    const target = event.currentTarget;

    if (target instanceof HTMLElement) {
      target.setPointerCapture(event.pointerId);
    }
  }


  // move
  startMove(event: PointerEvent, box: TextBoxModel): void {
    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    this.capturePointer(event);

    this.activeTextBoxId.set(box.id);

    this.pointerSession = {
      mode: 'move',
      id: box.id,
      pointerId: event.pointerId,

      startClientX: event.clientX,
      startClientY: event.clientY,

      startX: box.x,
      startY: box.y,
      startWidth: box.width,
      startHeight: this.getDisplayedHeight(box),
    };
  }


  // redimension
  startResize(
    event: PointerEvent,
    box: TextBoxModel,
    direction: ResizeDirection
  ): void {

    if (event.button !== 0) return;

    event.preventDefault();
    event.stopPropagation();

    this.capturePointer(event);

    this.activeTextBoxId.set(box.id);

    this.pointerSession = {
      mode: 'resize',
      id: box.id,
      pointerId: event.pointerId,

      startClientX: event.clientX,
      startClientY: event.clientY,

      startX: box.x,
      startY: box.y,
      startWidth: box.width,
      startHeight: this.getDisplayedHeight(box),

      direction,
    };
  }


  handlePointerMove(event: PointerEvent): void {

    const session = this.pointerSession;

    if (!session || event.pointerId !== session.pointerId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const deltaX = event.clientX - session.startClientX;
    const deltaY = event.clientY - session.startClientY;

    // Move box
    if (session.mode === 'move') {

      this.textBoxes.update(boxes =>
        boxes.map(box =>
          box.id === session.id
            ? {
                ...box,
                x: Math.max(0, session.startX + deltaX),
                y: Math.max(0, session.startY + deltaY),
              }
            : box
        )
      );

      return;
    }


    // Redimensionar box
    const direction = session.direction!;

    let x = session.startX;
    let y = session.startY;

    let width = session.startWidth;
    let height = session.startHeight;


    if (direction.includes('left')) {
      width = Math.max(
        this.minWidth,
        session.startWidth - deltaX
      );

      x = session.startX + session.startWidth - width;
    }

    if (direction.includes('right')) {
      width = Math.max(
        this.minWidth,
        session.startWidth + deltaX
      );
    }

    if (direction.includes('top')) {
      height = Math.max(
        this.minHeight,
        session.startHeight - deltaY
      );

      y = session.startY + session.startHeight - height;
    }

    if (direction.includes('bottom')) {
      height = Math.max(
        this.minHeight,
        session.startHeight + deltaY
      );
    }


    this.textBoxes.update(boxes =>
      boxes.map(box =>
        box.id === session.id
          ? { ...box, x, y, width, height }
          : box
      )
    );
  }

  // Remove emply box
  removeEmptyTextBox(id: string): void {

    this.textBoxes.update(boxes =>
      boxes.filter(box => box.id !== id)
    );

    // clear height
    this.contentHeights.update(current => {
      const updated = { ...current };

      delete updated[id];

      return updated;
    });

    // clear select
    if (this.activeTextBoxId() === id) {
      this.activeTextBoxId.set(null);
    }

    // Ajuste scroll
    requestAnimationFrame(() => {

      const canvas = this.canvas().nativeElement;

      const maxScrollTop = Math.max(
        0,
        canvas.scrollHeight - canvas.clientHeight
      );

      const maxScrollLeft = Math.max(
        0,
        canvas.scrollWidth - canvas.clientWidth
      );

      canvas.scrollTop = Math.min(
        canvas.scrollTop,
        maxScrollTop
      );

      canvas.scrollLeft = Math.min(
        canvas.scrollLeft,
        maxScrollLeft
      );

    });

  }

  // to finished operation
  endPointerAction(event: PointerEvent): void {

    if (
      !this.pointerSession ||
      event.pointerId !== this.pointerSession.pointerId
    ) {
      return;
    }

    event.stopPropagation();

    const target = event.currentTarget;

    if (
      target instanceof HTMLElement &&
      target.hasPointerCapture(event.pointerId)
    ) {
      target.releasePointerCapture(event.pointerId);
    }

    this.pointerSession = null;
  }

}