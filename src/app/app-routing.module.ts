import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	{
		path: 'grounds-test/:assetid/:testid',
		loadChildren: () => import('./grounds-test/grounds-test.module').then((m) => m.GroundsTestPageModule)
	},
	{
		path: 'signal-test/:assetid/:testid',
		loadChildren: () => import('./signal-test/signal-test.module').then((m) => m.SignalTestPageModule)
	},
	{
		path: 'repair-form/:assetid/:engineerid/:comments/:createddate',
		loadChildren: () => import('./repair-form/repair-form.module').then((m) => m.RepairFormPageModule)
	},
	{
		path: 'grounds-test',
		loadChildren: () => import('./grounds-test/grounds-test.module').then((m) => m.GroundsTestPageModule)
	},
	{
		path: 'selection',
		loadChildren: () => import('./pages/selection/selection.module').then((m) => m.SelectionPageModule)
	},
	{
		path: 'manage-repairs',
		loadChildren: () =>
			import('./pages/manage-repairs/manage-repairs.module').then((m) => m.ManageRepairsPageModule)
	},
	{
		path: 'repair-list',
		loadChildren: () => import('./pages/repair-list/repair-list.module').then((m) => m.RepairListPageModule)
	},
	{
		path: 'inspection-list',
		loadChildren: () =>
			import('./pages/inspection-list/inspection-list.module').then((m) => m.InspectionListPageModule)
	},
	{
		path: 'repair-form',
		loadChildren: () => import('./repair-form/repair-form.module').then((m) => m.RepairFormPageModule)
	},
	{
		path: 'create-asset',
		loadChildren: () => import('./pages/create-asset/create-asset.module').then((m) => m.CreateAssetPageModule)
	},
	{
		path: 'create-inspection',
		loadChildren: () =>
			import('./pages/create-inspection/create-inspection.module').then((m) => m.CreateInspectionPageModule)
	},
	{
		path: 'login',
		loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule)
	},
	{
		path: 'report-generation',
		loadChildren: () =>
			import('./pages/report-generation/report-generation.module').then((m) => m.ReportGenerationPageModule)
	},
	{
		path: 'syncer',
		loadChildren: () => import('./pages/syncer/syncer.module').then((m) => m.SyncerPageModule)
	},
	{
		path: 'signal-test',
		loadChildren: () => import('./signal-test/signal-test.module').then((m) => m.SignalTestPageModule)
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
