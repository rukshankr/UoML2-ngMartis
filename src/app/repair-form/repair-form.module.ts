import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RepairFormPageRoutingModule } from './repair-form-routing.module';

import { RepairFormPage } from './repair-form.page';
import { CreateRepairService } from '../services/create-repair.service';

@NgModule({
	imports: [ CommonModule, ReactiveFormsModule, IonicModule, RepairFormPageRoutingModule ],
	providers: [ CreateRepairService, DatePipe ],
	declarations: [ RepairFormPage ]
})
export class RepairFormPageModule {}
