import { TestBed, async, inject } from '@angular/core/testing';

import { DashboardActivateGuard } from './dashboard-activate.guard';

describe('DashboardActivateGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardActivateGuard]
    });
  });

  it('should ...', inject([DashboardActivateGuard], (guard: DashboardActivateGuard) => {
    expect(guard).toBeTruthy();
  }));
});
