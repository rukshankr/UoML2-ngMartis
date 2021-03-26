import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SyncerPage } from './syncer.page';

const routes: Routes = [
  {
    path: '',
    component: SyncerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SyncerPageRoutingModule {}
