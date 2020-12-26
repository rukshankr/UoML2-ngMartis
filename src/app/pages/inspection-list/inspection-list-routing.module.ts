import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InspectionListPage } from './inspection-list.page';

const routes: Routes = [
  {
    path: '',
    component: InspectionListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InspectionListPageRoutingModule {}
