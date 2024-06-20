import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { patientAuthGuardGuard } from './patient-auth-guard.guard';

describe('patientAuthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => patientAuthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
