import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SelectionPageModule } from '../selection/selection.module';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage
  },
  {
      path: 'selection', component: SelectionPageModule
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
