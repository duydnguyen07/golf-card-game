import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewOnlyCardColumnComponent } from './view-only-card-column.component';

describe('ViewOnlyCardColumnComponent', () => {
  let component: ViewOnlyCardColumnComponent;
  let fixture: ComponentFixture<ViewOnlyCardColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewOnlyCardColumnComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewOnlyCardColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
