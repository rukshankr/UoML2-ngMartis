import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignalTestPage } from './signal-test.page';

const routes: Routes = [
  {
    path: '',
    component: SignalTestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignalTestPageRoutingModule {}
