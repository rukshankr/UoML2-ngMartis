import { TestBed } from '@angular/core/testing';

import { CreateRepairService } from './create-repair.service';

describe('CreateRepairService', () => {
	let service: CreateRepairService;

	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(CreateRepairService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
