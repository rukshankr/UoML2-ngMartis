import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReportGenerationPage } from './report-generation.page';

describe('ReportGenerationPage', () => {
  let component: ReportGenerationPage;
  let fixture: ComponentFixture<ReportGenerationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportGenerationPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportGenerationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
