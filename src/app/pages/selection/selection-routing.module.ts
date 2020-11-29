import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectionPage } from './selection.page';

const routes: Routes = [
  {
    path: '',
    component: SelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SelectionPageRoutingModule {}
