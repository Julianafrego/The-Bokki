import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickNotes } from './quick-notes';

describe('QuickNotes', () => {
  let component: QuickNotes;
  let fixture: ComponentFixture<QuickNotes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickNotes],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickNotes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
