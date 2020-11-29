import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManageRepairsPage } from './manage-repairs.page';

describe('ManageRepairsPage', () => {
  let component: ManageRepairsPage;
  let fixture: ComponentFixture<ManageRepairsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageRepairsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageRepairsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
