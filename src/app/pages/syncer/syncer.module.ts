import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SyncerPageRoutingModule } from './syncer-routing.module';

import { SyncerPage } from './syncer.page';
import { HttpClientModule } from '@angular/common/http';
import { inspectionListService } from 'src/app/services/inspection-list.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HttpClientModule,
    SyncerPageRoutingModule
  ],
  declarations: [SyncerPage],
  providers: [ inspectionListService ]
})
export class SyncerPageModule {}
