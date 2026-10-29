import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotebookForm } from './notebook-form';

describe('NotebookForm', () => {
  let component: NotebookForm;
  let fixture: ComponentFixture<NotebookForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotebookForm],
    }).compileComponents();

    fixture = TestBed.createComponent(NotebookForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
