import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersBadgeComponent } from './players-badge.component';

describe('PlayersBadgeComponent', () => {
  let component: PlayersBadgeComponent;
  let fixture: ComponentFixture<PlayersBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersBadgeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayersBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
