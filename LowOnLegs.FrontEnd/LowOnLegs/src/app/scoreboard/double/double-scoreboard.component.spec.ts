import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoubleScoreboardComponent } from './double-scoreboard.component';

describe('DoubleScoreboardComponent', () => {
  let component: DoubleScoreboardComponent;
  let fixture: ComponentFixture<DoubleScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoubleScoreboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoubleScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
