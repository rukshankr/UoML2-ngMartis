import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportGenerationAssetPage } from './report-generation-asset.page';

const routes: Routes = [
  {
    path: '',
    component: ReportGenerationAssetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportGenerationAssetPageRoutingModule {}
