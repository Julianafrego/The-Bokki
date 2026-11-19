import {
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

import type { JSONContent } from '@tiptap/core';

import { TextBox } from '../text-box/text-box';
import type { TextBoxModel } from '../../../../data/models/text-box.model';
import { NotebookContentRepository } from '../../../../data/repository/notebook-content.repository';

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
  styleUrl: './notebook-page.css',
})
export class NotebookPage {

  title = input<string>('');
  pageId = input.required<number>();
  pageNumber = input<number>(1);

  readonly canvas =
    viewChild.required<ElementRef<HTMLDivElement>>('canvas');

  textBoxes = signal<TextBoxModel[]>([]);
  initialTextBoxes = input<TextBoxModel[]>([]);
  textBoxesChange = output<TextBoxModel[]>();

  private initializedFromInput = false;

  activeTextBoxId = signal<string | null>(null);

  // Altura medida pelo tiptap
  contentHeights = signal<Record<string, number>>({});

  private pointerSession: PointerSession | null = null;
  private contentRepository = inject(NotebookContentRepository);
  
  private readonly minWidth = 140;
  private readonly minHeight = 80;

  // for save with delay
  private destroyRef = inject(DestroyRef);
  private saveTimers = new Map<string, ReturnType<typeof setTimeout>>();
  private readonly saveDelay = 500;

  // sicronize with local signal
  constructor() {
    effect(() => {
      const initialBoxes = this.initialTextBoxes();

      if (!this.initializedFromInput && initialBoxes.length > 0) {
        this.textBoxes.set(initialBoxes);
        this.initializedFromInput = true;
      }
    });
  }

  // create new box
  createTextBoxAt(event: MouseEvent): void {
    const element = this.canvas().nativeElement;
    const rect = element.getBoundingClientRect();

    console.log('Clique recebido no canvas:', {
      clientX: event.clientX,
      clientY: event.clientY,
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    });

    const id = crypto.randomUUID();

    const newBox: TextBoxModel = {
      id,
      pageId: this.pageId(),
      x: event.clientX - rect.left + element.scrollLeft,
      y: event.clientY - rect.top + element.scrollTop,
      width: 300,
      height: this.minHeight,
      content: {
        type: 'doc',
        content: [{ type: 'paragraph' }]
      }
    };

    console.log('Nova caixa criada:', newBox);

    this.textBoxes.update(boxes => [...boxes, newBox]);
    this.notifyTextBoxesChange();

    this.activeTextBoxId.set(id);

    void this.persistTextBox(newBox);
  }

  // updated boxes lists
  private notifyTextBoxesChange(): void {
    this.textBoxesChange.emit(this.textBoxes());
  }


  // --------public functions---------

  selectTextBox(id: string, event: MouseEvent): void {
    event.stopPropagation();

    this.activeTextBoxId.set(id);
  }


  updateTextBoxContent(id: string, content: JSONContent): void {
    console.log('[1] Alteração recebida:', id, content);
    let updatedBox: TextBoxModel | undefined;
    
    this.textBoxes.update(boxes => 
      boxes.map(box => {
        if (box.id !== id ) return box;
        
        updatedBox = { ...box, content };
        return updatedBox;
      })
    );

    if (!updatedBox) return;
    this.notifyTextBoxesChange();

    // cancel last save
    const previousTimer = this.saveTimers.get(id);

    if (previousTimer) {
      clearTimeout(previousTimer);
    }

    const timer = setTimeout(() => {
      this.saveTimers.delete(id);

      const latestBox = this.textBoxes().find(box => box.id === id);

      if (latestBox) {
        void this.persistTextBox(latestBox);
      }
    }, this.saveDelay);

    this.saveTimers.set(id, timer);
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
    void this.contentRepository.deleteTextBox(id);

    this.textBoxes.update(boxes =>
      boxes.filter(box => box.id !== id)
    );

    this.notifyTextBoxesChange();

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

  this.textBoxes.update(boxes =>
    boxes.filter(box => box.id !== id)
  );
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

    const updatedBox = this.textBoxes().find(
      box => box.id === this.activeTextBoxId()
    );

    if (updatedBox) {
      void this.persistTextBox(updatedBox);
      this.notifyTextBoxesChange();
    }
  }

  //---------private functions------

  private async persistTextBox(box: TextBoxModel): Promise<void> {
    try {
      console.log('[3] Enviando para SQLite:', box.id);
      await this.contentRepository.saveTextBox(box);
      console.log('[4] Salvamento concluído:', box.id);
    } catch (error) {
      console.error('Could not save text box:', error);
    }
  }


  // capture pointer to ensure we receive all events during drag
  private capturePointer(event: PointerEvent): void {
    const target = event.currentTarget;

    if (target instanceof HTMLElement) {
      target.setPointerCapture(event.pointerId);
    }
  }
}