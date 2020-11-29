import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes : Recipe[] = [
    {
      id: 'r1',
      title: 'Schintzel',
      imageUrl: 'https://www.thespruceeats.com/thmb/cckc3_4QUQ79kSFhcLPM8xg9F3g=/3797x2848/smart/filters:no_upscale()/wiener-schnitzel-recipe-1447089-Hero-5b587d6c46e0fb0071b0059d.jpg',
      ingredients: ['French fries','Pork meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Milkrice',
      imageUrl: 'https://www.thespruceeats.com/thmb/cckc3_4QUQ79kSFhcLPM8xg9F3g=/3797x2848/smart/filters:no_upscale()/wiener-schnitzel-recipe-1447089-Hero-5b587d6c46e0fb0071b0059d.jpg',
      ingredients: ['Milk','Rice', 'Salt']
    }
  ];


  constructor() { }

  getAllRecipes() {
    return [...this.recipes];
  }

  getRecipe (recipeId: string){
    return { //to add to a new object 
      ...this.recipes.find(recipe => {
      return recipe.id === recipeId;
    })
  };
  }
  deleteRecipe (recipeId: string){
    this.recipes = this.recipes.filter(recipe => {
      return recipe.id !== recipeId;
    })
  }
}

