import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateInspectionPage } from './create-inspection.page';

describe('CreateInspectionPage', () => {
  let component: CreateInspectionPage;
  let fixture: ComponentFixture<CreateInspectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInspectionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateInspectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
