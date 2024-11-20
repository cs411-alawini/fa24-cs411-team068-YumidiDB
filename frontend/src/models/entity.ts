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
