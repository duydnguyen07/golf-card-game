import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyGameBoardComponent } from './my-game-board.component';

describe('MyGameBoardComponent', () => {
  let component: MyGameBoardComponent;
  let fixture: ComponentFixture<MyGameBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGameBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyGameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
