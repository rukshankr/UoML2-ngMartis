import { TestBed } from '@angular/core/testing';

import { RepairListService } from './repair-list.service';

describe('RepairListService', () => {
	let service: RepairListService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(RepairListService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
