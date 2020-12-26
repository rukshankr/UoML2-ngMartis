import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RepairFormPage } from './repair-form.page';

describe('RepairFormPage', () => {
  let component: RepairFormPage;
  let fixture: ComponentFixture<RepairFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairFormPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RepairFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
