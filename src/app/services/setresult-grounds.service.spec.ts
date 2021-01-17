import { TestBed } from '@angular/core/testing';

import { SetresultGroundsService } from './setresult-grounds.service';

describe('SetresultGroundsService', () => {
  let service: SetresultGroundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SetresultGroundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
