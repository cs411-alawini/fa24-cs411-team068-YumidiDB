// define the entity in front end
export interface Recipe {
    recipe_id: number;
    name: string;
    minutes: number;
    description: string;
    steps: string;
    fat: number;
    calories: number;
    protein: number;
    rating?: string;
}


export interface CustomizedRecipe {
    calories: number;
    customized_id: number;
    description: string;
    fat: number;
    protein:number;
    minutes: number;
    name: string;
    steps: string;
    user_id: number;
    rating?: string;
}