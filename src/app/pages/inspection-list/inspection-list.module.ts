import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InspectionListPageRoutingModule } from './inspection-list-routing.module';
import { InspectionListPage } from './inspection-list.page';
import { HttpClientModule } from '@angular/common/http';
import { inspectionListService } from 'src/app/services/inspection-list.service';

@NgModule({
	imports: [ CommonModule, FormsModule, IonicModule, InspectionListPageRoutingModule, HttpClientModule ],
	declarations: [ InspectionListPage ],
	providers: [ inspectionListService, Geolocation ]
})
export class InspectionListPageModule {}
