import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateInspectionPageRoutingModule } from './create-inspection-routing.module';

import { CreateInspectionPage } from './create-inspection.page';
import { InspectionService } from 'src/app/services/create-inspection.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CreateInspectionPageRoutingModule
  ],
  providers: [InspectionService, DatePipe],
  declarations: [CreateInspectionPage]
})
export class CreateInspectionPageModule {}
