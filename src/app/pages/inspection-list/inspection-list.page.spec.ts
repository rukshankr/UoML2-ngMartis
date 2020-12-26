import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InspectionListPage } from './inspection-list.page';

describe('InspectionListPage', () => {
  let component: InspectionListPage;
  let fixture: ComponentFixture<InspectionListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InspectionListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
