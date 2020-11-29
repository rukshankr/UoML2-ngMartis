import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepairListPage } from './repair-list.page';

const routes: Routes = [
  {
    path: '',
    component: RepairListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RepairListPageRoutingModule {}
