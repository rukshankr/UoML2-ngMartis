import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateInspectionPageRoutingModule } from './create-inspection-routing.module';

import { CreateInspectionPage } from './create-inspection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateInspectionPageRoutingModule
  ],
  declarations: [CreateInspectionPage]
})
export class CreateInspectionPageModule {}
