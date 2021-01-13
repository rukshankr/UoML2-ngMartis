import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroundsTestPageRoutingModule } from './grounds-test-routing.module';

import { GroundsTestPage } from './grounds-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroundsTestPageRoutingModule
  ],
  declarations: [GroundsTestPage]
})
export class GroundsTestPageModule {}
