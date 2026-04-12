import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleScoreboardComponent } from './single-scoreboard..component';

describe('ScoreboardComponent', () => {
  let component: SingleScoreboardComponent;
  let fixture: ComponentFixture<SingleScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleScoreboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
