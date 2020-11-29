import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageRepairsPage } from './manage-repairs.page';

const routes: Routes = [
  {
    path: '',
    component: ManageRepairsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRepairsPageRoutingModule {}
