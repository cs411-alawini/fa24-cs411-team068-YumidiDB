import internal from "stream";

// src/types/database.ts

export interface Recipe {
    recipe_id: number;
    name: string;
    minutes: number;
    description: string;
    steps: string;
    fat: number;
    calories: number;
    protein: number;
}

export interface User {
    user_id: number;
    user_name: string;
    hashed_password: string;
}

export interface Ingredient {
    ingredient_id: number;
    ingredient_name: string;
}

export interface CustomizedRecipe {
    customized_id: number;
    user_id: number;
    name: string;
    minutes: number;
    steps: string;
    description: string;
    fat: number;
    calories: number;
}

export interface Review {
    review_id: number;
    recipe_id: number;
    review_content: string;
    rating: number;
    date: Date;
}

export interface IngredientPortion {
    id: number;
    customized_id: number;
    ingredient_id: number;
    ingredient_amount: number;
    ingredient_unit: string;
}

export interface user_restriction {
    id: number;
    user_id: number;
    ingredient_id: number;
}

export interface RecipeIngredient {
    id: number;
    recipe_id: number;
    ingredient_id: number;
}