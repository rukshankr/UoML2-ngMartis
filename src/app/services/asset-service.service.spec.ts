import { TestBed } from '@angular/core/testing';

import { AssetServiceService } from './asset-service.service';

describe('AssetServiceService', () => {
  let service: AssetServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
