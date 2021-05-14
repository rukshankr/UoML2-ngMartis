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
import { MobileLoginComponent } from "./mobile-login/mobile-login.component";

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
    path: "signal-test/:assetid/:testid",
    loadChildren: () =>
      import("./signal-test/signal-test.module").then(
        (m) => m.SignalTestPageModule
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
    path: "signal-test/:assetid/:testid",
    loadChildren: () =>
      import("./signal-test/signal-test.module").then(
        (m) => m.SignalTestPageModule
      ),
  },
  {
    path: "selection",
    loadChildren: () =>
      import("./pages/selection/selection.module").then(
        (m) => m.SelectionPageModule
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
    path: "create-inspection/:id",
    loadChildren: () =>
      import("./pages/create-inspection/create-inspection.module").then(
        (m) => m.CreateInspectionPageModule
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
    path: "signal-test",
    loadChildren: () =>
      import("./signal-test/signal-test.module").then(
        (m) => m.SignalTestPageModule
      ),
  },
  {
    path: "login/callback",
    component: OktaCallbackComponent,
  },
  {
    path: "report-generation-asset",
    loadChildren: () =>
      import("./report-generation-asset/report-generation-asset.module").then(
        (m) => m.ReportGenerationAssetPageModule
      ),
  },
  {
    path: "mobile-login",
    component: MobileLoginComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    // OktaAuthModule,
  ],
  //providers: [{ provide: OKTA_CONFIG, useValue: config }, OktaAuthGuard],
  exports: [RouterModule],
})
export class AppRoutingModule {}
