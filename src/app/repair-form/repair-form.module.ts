import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepairFormPageRoutingModule } from './repair-form-routing.module';

import { RepairFormPage } from './repair-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepairFormPageRoutingModule
  ],
  declarations: [RepairFormPage]
})
export class RepairFormPageModule {}
