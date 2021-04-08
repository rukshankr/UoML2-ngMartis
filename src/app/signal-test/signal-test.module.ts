import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SignalTestPageRoutingModule } from './signal-test-routing.module';

import { SignalTestPage } from './signal-test.page';
import { SetresultGroundsService } from 'src/app/services/setresult-grounds.service';

@NgModule({
	imports: [ CommonModule, ReactiveFormsModule, IonicModule, SignalTestPageRoutingModule ],
	providers: [ SetresultGroundsService ],
	declarations: [ SignalTestPage ]
})
export class SignalTestPageModule {}
