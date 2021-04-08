import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DatePipe } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { ReportGenerationPageRoutingModule } from './report-generation-routing.module';

import { ReportGenerationPage } from './report-generation.page';

import { CreateReportEmpidService } from 'src/app/services/create-report-empid.service';

@NgModule({
	imports: [ CommonModule, ReactiveFormsModule, IonicModule, ReportGenerationPageRoutingModule ],
	providers: [ CreateReportEmpidService, DatePipe ],
	declarations: [ ReportGenerationPage ]
})
export class ReportGenerationPageModule {}
