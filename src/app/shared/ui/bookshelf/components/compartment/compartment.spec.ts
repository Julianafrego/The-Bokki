import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Compartment } from './compartment';

describe('Compartment', () => {
  let component: Compartment;
  let fixture: ComponentFixture<Compartment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compartment],
    }).compileComponents();

    fixture = TestBed.createComponent(Compartment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
