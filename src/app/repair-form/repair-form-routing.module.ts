import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepairFormPage } from './repair-form.page';

const routes: Routes = [
  {
    path: '',
    component: RepairFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepairFormPageRoutingModule {}
