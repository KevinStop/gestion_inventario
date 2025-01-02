import { TestBed } from '@angular/core/testing';

import { ComponentMovementService } from './component-movement.service';

describe('ComponentMovementService', () => {
  let service: ComponentMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
