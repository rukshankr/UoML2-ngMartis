import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageRepairsPageRoutingModule } from './manage-repairs-routing.module';

import { ManageRepairsPage } from './manage-repairs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageRepairsPageRoutingModule
  ],
  declarations: [ManageRepairsPage]
})
export class ManageRepairsPageModule {}
