import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReportGenerationAssetPageRoutingModule } from './report-generation-asset-routing.module';
import { ReportGenerationAssetPage } from './report-generation-asset.page';
import { CreateReportEmpidService } from 'src/app/services/create-report-empid.service';

@NgModule({
	imports: [ CommonModule, ReactiveFormsModule, IonicModule, ReportGenerationAssetPageRoutingModule ],
	providers: [ CreateReportEmpidService, DatePipe ],
	declarations: [ ReportGenerationAssetPage ]
})
export class ReportGenerationAssetPageModule {}
