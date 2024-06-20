import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { therapistAuthGuardGuard } from './therapist-auth-guard.guard';

describe('therapistAuthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => therapistAuthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
