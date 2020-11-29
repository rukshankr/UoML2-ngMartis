import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RepairListPageRoutingModule } from './repair-list-routing.module';

import { RepairListPage } from './repair-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RepairListPageRoutingModule
  ],
  declarations: [RepairListPage]
})
export class RepairListPageModule {}
