import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RepairListPage } from './repair-list.page';

describe('RepairListPage', () => {
	let component: RepairListPage;
	let fixture: ComponentFixture<RepairListPage>;

	beforeEach(
		async(() => {
			TestBed.configureTestingModule({
				declarations: [ RepairListPage ],
				imports: [ IonicModule.forRoot() ]
			}).compileComponents();

			fixture = TestBed.createComponent(RepairListPage);
			component = fixture.componentInstance;
			fixture.detectChanges();
		})
	);

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
