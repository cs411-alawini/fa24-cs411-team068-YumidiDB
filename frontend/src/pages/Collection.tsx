import React, { useState, useEffect } from "react";
import { Recipe } from "../models/entity";
import { CollectionRecipeCard } from "../components/CollectionRecipeCard";
import { useNavigate } from "react-router-dom";
import "./styles/Collection.css";

const Collection: React.FC = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollectedRecipes();
    }, []);

    const fetchCollectedRecipes = async () => {
        try {
            const response = await fetch('http://localhost:3007/api/collection/getCustomizedRecipeList',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'});
            if (!response.ok) {
                throw new Error('Failed to fetch collections');
            }
            const data = await response.json();
            setRecipes(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRecipeDelete = async (recipe: Recipe) => {
        try {
            const response = await fetch(
                `http://localhost:3007/api/collections/delete/${recipe.recipe_id}`,
                {
                    method: 'DELETE',
                }
            );

            if (!response.ok) {
                throw new Error('Failed to delete recipe');
            }

            alert('Recipe removed from collection');
            // Refresh the list
            setRecipes(recipes.filter(r => r.recipe_id !== recipe.recipe_id));
        } catch (err) {
            alert('Failed to delete recipe');
            console.error('Error deleting recipe:', err);
        }
    };

    const handleRecipeSelect = (recipe: Recipe) => {
        navigate(`/collection/recipe/${recipe.recipe_id}`, { state: { recipe } });
    };

    if (isLoading) {
        return <div className="loading">Loading your collection...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="collection-container">
            <h1 className="collection-title">My Recipe Collection</h1>
            {recipes.length === 0 ? (
                <div className="empty-collection">
                    <p>Your collection is empty.</p>
                    <button 
                        onClick={() => navigate('/planner')}
                        className="browse-button"
                    >
                        Browse Recipes
                    </button>
                </div>
            ) : (
                <div className="recipe-grid">
                    {recipes.map((recipe) => (
                        <CollectionRecipeCard
                            key={recipe.recipe_id}
                            recipe={recipe}
                            onSelect={handleRecipeSelect}
                            onDelete={handleRecipeDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Collection;