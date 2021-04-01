import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OktaCallbackComponent } from "@okta/okta-angular";
import { SelectionPageModule } from "../selection/selection.module";

import { LoginPage } from "./login.page";

const routes: Routes = [
  {
    path: "",
    component: LoginPage,
  },
  {
    path: "login/callback",
    component: OktaCallbackComponent,
  },
  {
    path: "selection",
    component: SelectionPageModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
