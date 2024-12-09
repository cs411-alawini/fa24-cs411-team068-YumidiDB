import React, { useState, useEffect } from "react";
import { Recipe } from "../models/entity";
import { RecipeCard } from "../components/RecipeCard";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import "./styles/Planner.css";

const Planner: React.FC = () => {
    const { calorieRange } = useParams<{ calorieRange?: string }>();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Parse calorie range from URL or use defaults
    const [minCalories, setMinCalories] = useState<number>(() => {
        if (calorieRange) {
            const [min] = calorieRange.split('-').map(Number);
            return isNaN(min) ? 0 : min;
        }
        return 0;
    });
    
    const [maxCalories, setMaxCalories] = useState<number>(() => {
        if (calorieRange) {
            const [, max] = calorieRange.split('-').map(Number);
            return isNaN(max) ? 1000 : max;
        }
        return 1000;
    });

    const navigate = useNavigate();
    const location = useLocation();

    // Check if we're on a search route
    const isSearchResults = Boolean(calorieRange);

    // Fetch recipes when URL parameters change
    useEffect(() => {
        if (isSearchResults) {
            fetchRecipes();
        }
    }, [calorieRange]);

    const fetchRecipes = async () => {
        try {            
            setIsLoading(true);
    
            const queryParams = new URLSearchParams({
                min_calories: minCalories.toString(),
                max_calories: maxCalories.toString(),
                count: '15'
            });
    
            console.log(queryParams.toString());
            const response = await fetch(
                `http://localhost:3007/api/planner/getRecipeByFilter?${queryParams.toString()}`,{
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    }}
            );
        
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to fetch recipes');
            }
            const data = await response.json();
            setRecipes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching recipes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Navigate to search results with calorie range in path
        navigate(`/planner/${minCalories}-${maxCalories}`);
    };

    const handleRecipeSelect = (recipe: Recipe) => {
        console.log(recipe);
        navigate(`/recipe/${recipe.recipe_id}`, { 
            state: { recipe }
        });
    };


    const handleRecipeCollect = async (recipe: Recipe) => {
        try {
            const response = await fetch(
                'http://localhost:3007/api/collections/add',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        recipeId: recipe.recipe_id,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || 'Failed to add to collection');
            }

            alert(`${recipe.name} has been added to your collection!`);

        } catch (err) {
            alert('Failed to add recipe to collection');
            console.error('Error adding to collection:', err);
            throw err;
        }
    };

    return (
        <div className="container">
            <div className="search-section">
                <div className="search-header">
                    <h2 className="search-title">Search Recipes by Calories</h2>
                    {isSearchResults}
                </div>
                <form onSubmit={handleFilterSubmit} className="filter-form">
                    <div className="filter-group">
                        <label className="filter-label">
                            Min Calories:
                            <input
                                type="number"
                                value={minCalories}
                                onChange={(e) => setMinCalories(Number(e.target.value))}
                                min="0"
                                className="filter-input"
                            />
                        </label>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">
                            Max Calories:
                            <input
                                type="number"
                                value={maxCalories}
                                onChange={(e) => setMaxCalories(Number(e.target.value))}
                                min={minCalories}
                                className="filter-input"
                            />
                        </label>
                    </div>
                    <button type="submit" className="search-button">
                        Search Recipes
                    </button>
                </form>
            </div>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}

            {isSearchResults && !isLoading && (
                <div className="results-section">
                    <h3 className="results-title">
                        {recipes.length > 0 
                            ? `Found ${recipes.length} recipes`
                            : 'No recipes found'}
                    </h3>
                    <div className="recipe-grid">
                        {recipes.map((recipe) => (
                            <RecipeCard 
                                key={recipe.recipe_id} 
                                recipe={recipe}
                                onSelect={handleRecipeSelect}
                                onCollect={handleRecipeCollect}
                            />
                        ))}
                    </div>
                </div>
            )}

            {!isSearchResults && (
                <div className="initial-state">
                    <p>Enter calorie range and click "Search Recipes" to find recipes.</p>
                </div>
            )}
        </div>
    );
};

export default Planner;