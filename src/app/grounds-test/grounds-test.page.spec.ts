import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GroundsTestPage } from './grounds-test.page';

describe('GroundsTestPage', () => {
  let component: GroundsTestPage;
  let fixture: ComponentFixture<GroundsTestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroundsTestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GroundsTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
