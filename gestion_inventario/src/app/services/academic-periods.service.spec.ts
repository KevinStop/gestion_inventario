import { TestBed } from '@angular/core/testing';

import { AcademicPeriodsService } from './academic-periods.service';

describe('AcademicPeriodsService', () => {
  let service: AcademicPeriodsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademicPeriodsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
