import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateAssetPage } from './create-asset.page';

describe('CreateAssetPage', () => {
  let component: CreateAssetPage;
  let fixture: ComponentFixture<CreateAssetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAssetPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAssetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
