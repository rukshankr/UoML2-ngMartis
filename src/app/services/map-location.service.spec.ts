import { TestBed } from '@angular/core/testing';

import { MapLocationService } from './map-location.service';

describe('MapLocationService', () => {
  let service: MapLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
