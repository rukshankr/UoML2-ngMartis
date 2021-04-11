import { TestBed } from '@angular/core/testing';

import { CreateReportEmpidService } from './create-report-empid.service';

describe('CreateReportEmpidService', () => {
  let service: CreateReportEmpidService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateReportEmpidService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
