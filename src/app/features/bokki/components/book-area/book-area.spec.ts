import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookArea } from './book-area';

describe('BookArea', () => {
  let component: BookArea;
  let fixture: ComponentFixture<BookArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookArea],
    }).compileComponents();

    fixture = TestBed.createComponent(BookArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
