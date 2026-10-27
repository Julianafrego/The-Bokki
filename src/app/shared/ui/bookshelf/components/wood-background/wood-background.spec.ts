import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WoodBackground } from './wood-background';

describe('WoodBackground', () => {
  let component: WoodBackground;
  let fixture: ComponentFixture<WoodBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WoodBackground],
    }).compileComponents();

    fixture = TestBed.createComponent(WoodBackground);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
