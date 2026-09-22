import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotebookList } from './notebook-list';

describe('NotebookList', () => {
  let component: NotebookList;
  let fixture: ComponentFixture<NotebookList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookList],
    }).compileComponents();

    fixture = TestBed.createComponent(NotebookList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
