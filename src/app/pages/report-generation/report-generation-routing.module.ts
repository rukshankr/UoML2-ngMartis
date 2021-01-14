import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportGenerationPage } from './report-generation.page';

const routes: Routes = [
  {
    path: '',
    component: ReportGenerationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportGenerationPageRoutingModule {}
