import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'selection',
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    children: [
      {
        path: '',
        loadChildren: () => import('./recipes/recipes.module').then( m => m.RecipesPageModule),
      },
      {
        path:':recipeId',
        loadChildren: () => import('./recipes/recipe-detail/recipe-detail.module').then(m => m.RecipeDetailPageModule)
      }
    ]
  },
  {
    path: 'selection',
    loadChildren: () => import('./pages/selection/selection.module').then( m => m.SelectionPageModule)
  },
  {
    path: 'manage-repairs',
    loadChildren: () => import('./pages/manage-repairs/manage-repairs.module').then( m => m.ManageRepairsPageModule)
  },
  {
    path: 'repair-list',
    loadChildren: () => import('./pages/repair-list/repair-list.module').then( m => m.RepairListPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
