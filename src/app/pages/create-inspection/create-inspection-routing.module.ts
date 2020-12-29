import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateInspectionPage } from './create-inspection.page';

const routes: Routes = [
  {
    path: '',
    component: CreateInspectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateInspectionPageRoutingModule {}
