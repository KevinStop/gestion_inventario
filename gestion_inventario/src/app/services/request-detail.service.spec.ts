import { TestBed } from '@angular/core/testing';

import { RequestDetailService } from './request-detail.service';

describe('RequestDetailService', () => {
  let service: RequestDetailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestDetailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
