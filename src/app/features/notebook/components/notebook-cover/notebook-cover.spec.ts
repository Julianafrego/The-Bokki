import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotebookCover } from './notebook-cover';

describe('NotebookCover', () => {
  let component: NotebookCover;
  let fixture: ComponentFixture<NotebookCover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookCover],
    }).compileComponents();

    fixture = TestBed.createComponent(NotebookCover);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
