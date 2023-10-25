import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CenterDeckComponent } from './center-deck.component';

describe('CenterDeckComponent', () => {
  let component: CenterDeckComponent;
  let fixture: ComponentFixture<CenterDeckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CenterDeckComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CenterDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
