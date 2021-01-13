import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroundsTestPage } from './grounds-test.page';

const routes: Routes = [
  {
    path: '',
    component: GroundsTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroundsTestPageRoutingModule {}
