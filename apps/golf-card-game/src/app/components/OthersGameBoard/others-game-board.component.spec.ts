import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OthersGameBoardComponent } from './others-game-board.component';

describe('OthersGameBoardComponent', () => {
  let component: OthersGameBoardComponent;
  let fixture: ComponentFixture<OthersGameBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OthersGameBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OthersGameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
