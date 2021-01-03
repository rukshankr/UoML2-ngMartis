import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateAssetPageRoutingModule } from './create-asset-routing.module';
import { CreateAssetPage } from './create-asset.page';
import { AssetService } from 'src/app/services/asset-service.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    CreateAssetPageRoutingModule
  ],
  providers: [AssetService],
  declarations: [CreateAssetPage]
})
export class CreateAssetPageModule {}
