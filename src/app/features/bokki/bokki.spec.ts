import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Bokki } from './bokki';

describe('Bokki', () => {
  let component: Bokki;
  let fixture: ComponentFixture<Bokki>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bokki],
    }).compileComponents();

    fixture = TestBed.createComponent(Bokki);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
