import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotebookPage } from './notebook-page';

describe('NotebookPage', () => {
  let component: NotebookPage;
  let fixture: ComponentFixture<NotebookPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookPage],
    }).compileComponents();

    fixture = TestBed.createComponent(NotebookPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
