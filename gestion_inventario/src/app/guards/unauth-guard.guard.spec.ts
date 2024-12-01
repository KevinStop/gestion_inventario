import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { unauthGuardGuard } from './unauth-guard.guard';

describe('unauthGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => unauthGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
