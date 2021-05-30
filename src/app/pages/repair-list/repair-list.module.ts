import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RepairListPageRoutingModule } from './repair-list-routing.module';
import { RepairListPage } from './repair-list.page';
import { RepairListService } from 'src/app/services/repair-list.service';

@NgModule({
	imports: [ CommonModule, FormsModule, IonicModule, RepairListPageRoutingModule ],
	declarations: [ RepairListPage ],
	providers: [ RepairListService, DatePipe ]
})
export class RepairListPageModule {}
