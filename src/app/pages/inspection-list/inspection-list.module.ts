import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InspectionListPageRoutingModule } from './inspection-list-routing.module';

import { InspectionListPage } from './inspection-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InspectionListPageRoutingModule
  ],
  declarations: [InspectionListPage]
})
export class InspectionListPageModule {}
