import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {SelectionPageModule} from './pages/selection/selection.module';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full'
	},
	
	// {
	// 	path: 'recipes',
	// 	children: [
	// 		{
	// 			path: '',
	// 			loadChildren: () => import('./recipes/recipes.module').then((m) => m.RecipesPageModule)
	// 		},
	// 		{
	// 			path: ':recipeId',
	// 			loadChildren: () =>
	// 				import('./recipes/recipe-detail/recipe-detail.module').then((m) => m.RecipeDetailPageModule)
	// 		}
	// 	]
	// },
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
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }) ],
	exports: [ RouterModule ]
})
export class AppRoutingModule {}
