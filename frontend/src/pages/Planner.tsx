import React, { useState } from "react";
import { Recipe } from "../models/entity";
import { RecipeCard } from "../components/RecipeCard";
import { RecipeDetail } from "../components/RecipeDetail";
import "./styles/Planner.css";

const Planner: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState<string | null>(null);
    const [minCalories, setMinCalories] = useState<number>(0);
    const [maxCalories, setMaxCalories] = useState<number>(1000);
    const [hasSearched, setHasSearched] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    const fetchRecipes = async () => {
        try {
            console.log("Fetching with calories range:", minCalories, maxCalories);
            
            setIsLoading(true);
            setHasSearched(true);

            const queryParams = new URLSearchParams({
                min_calories: minCalories.toString(),
                max_calories: maxCalories.toString(),
                count: '15'
            });

            const response = await fetch(
                `http://localhost:3007/api/planner/getRecipeByFilter?${queryParams.toString()}`, 
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                console.log("Response error:", response);
                throw new Error('Failed to fetch recipes');
            }
            const data = await response.json();
            console.log("Received data:", data);
            setRecipes(data);
            setSelectedRecipe(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching recipes:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchRecipes();
    };

    if (error) {
        return (
            <div className="container error-container">
                <p className="error-text">Error: {error}</p>
                <button 
                    onClick={() => setError(null)} 
                    className="retry-button"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="search-section">
                <h2 className="search-title">Search Recipes by Calories</h2>
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

            {hasSearched && !isLoading && (
                <div className="results-section">
                    <h3 className="results-title">
                        {recipes.length > 0 
                            ? `Found ${recipes.length} recipes`
                            : 'No recipes found'}
                    </h3>
                    <div className="content-layout">
                        <div className="recipe-grid">
                            {recipes.map((recipe) => (
                                <RecipeCard 
                                    key={recipe.recipe_id} 
                                    recipe={recipe}
                                    onSelect={setSelectedRecipe}
                                    isSelected={selectedRecipe?.recipe_id === recipe.recipe_id}
                                />
                            ))}
                        </div>
                        {selectedRecipe && (
                            <div className="details-panel">
                                <RecipeDetail recipe={selectedRecipe} />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!hasSearched && (
                <div className="initial-state">
                    <p>Enter calorie range and click "Search Recipes" to find recipes.</p>
                </div>
            )}
        </div>
    );
};

export default Planner;