import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  PreloadAllModules,
  Router,
  RouterModule,
  Routes,
} from "@angular/router";
import { SelectionPageModule } from "./pages/selection/selection.module";
import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard,
} from "@okta/okta-angular";
import { LoginComponent } from "./login-comp/login-comp.component";
import { AppComponent } from "./app.component";

const config = {
  issuer: "https://dev-44560058.okta.com/oauth2/default",
  redirectUri: "http://localhost:8100/selection",
  clientId: "0oag5ujmllTDi2zrM5d6",
  pkce: true,
};

export function onAuthRequired(oktaAuth, injector) {
  const router = injector.get(Router);

  // Redirect the user to your custom login page
  router.navigate(["/login"]);
}

const routes: Routes = [
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "grounds-test/:assetid/:testid",
    loadChildren: () =>
      import("./grounds-test/grounds-test.module").then(
        (m) => m.GroundsTestPageModule
      ),
  },
  {
    path: "repair-form/:assetid/:engineerid/:comments/:createddate",
    loadChildren: () =>
      import("./repair-form/repair-form.module").then(
        (m) => m.RepairFormPageModule
      ),
  },
  {
    path: "grounds-test",
    loadChildren: () =>
      import("./grounds-test/grounds-test.module").then(
        (m) => m.GroundsTestPageModule
      ),
  },
  {
    path: "selection",
    canActivateChild: [OktaAuthGuard],
    data: {
      onAuthRequired,
    },
    loadChildren: () =>
      import("./pages/selection/selection.module").then(
        (m) => m.SelectionPageModule
      ),
  },
  {
    path: "manage-repairs",
    loadChildren: () =>
      import("./pages/manage-repairs/manage-repairs.module").then(
        (m) => m.ManageRepairsPageModule
      ),
  },
  {
    path: "repair-list",
    loadChildren: () =>
      import("./pages/repair-list/repair-list.module").then(
        (m) => m.RepairListPageModule
      ),
  },
  {
    path: "inspection-list",
    loadChildren: () =>
      import("./pages/inspection-list/inspection-list.module").then(
        (m) => m.InspectionListPageModule
      ),
  },
  {
    path: "repair-form",
    loadChildren: () =>
      import("./repair-form/repair-form.module").then(
        (m) => m.RepairFormPageModule
      ),
  },
  {
    path: "create-asset",
    loadChildren: () =>
      import("./pages/create-asset/create-asset.module").then(
        (m) => m.CreateAssetPageModule
      ),
  },
  {
    path: "create-inspection",
    loadChildren: () =>
      import("./pages/create-inspection/create-inspection.module").then(
        (m) => m.CreateInspectionPageModule
      ),
  },
  {
    path: "login",
    // loadChildren: () =>
    //   import("./pages/login/login.module").then((m) => m.LoginPageModule),
    component: LoginComponent,
  },
  {
    path: "report-generation",
    loadChildren: () =>
      import("./pages/report-generation/report-generation.module").then(
        (m) => m.ReportGenerationPageModule
      ),
  },
  {
    path: "syncer",
    loadChildren: () =>
      import("./pages/syncer/syncer.module").then((m) => m.SyncerPageModule),
  },
  {
    path: "login/callback",
    component: OktaCallbackComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    OktaAuthModule,
  ],
  providers: [{ provide: OKTA_CONFIG, useValue: config }],
  exports: [RouterModule],
})
export class AppRoutingModule {}
