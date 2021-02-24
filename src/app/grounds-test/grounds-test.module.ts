import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroundsTestPageRoutingModule } from './grounds-test-routing.module';

import { GroundsTestPage } from './grounds-test.page';

import { SetresultGroundsService } from 'src/app/services/setresult-grounds.service';

@NgModule({
	imports: [ CommonModule, ReactiveFormsModule, IonicModule, GroundsTestPageRoutingModule ],
	providers: [ SetresultGroundsService ],
	declarations: [ GroundsTestPage ]
})
export class GroundsTestPageModule {}
