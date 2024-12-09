import React from "react";
import { CustomizedRecipe } from "../models/entity";
import "./RecipeCard.css";

interface RecipeCardProps {
    recipe: CustomizedRecipe;
    onSelect: (recipe: CustomizedRecipe) => void;
    onDelete: (recipe: CustomizedRecipe) => void;
}

export function CollectionRecipeCard({ recipe, onSelect, onDelete }: RecipeCardProps) {
    const { name, description, rating } = recipe;

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to remove this recipe from your collection?')) {
            onDelete(recipe);
        }
    };

    return (
        <div className="card">
            <div className="card-content">
                <div className="card-header">
                    <h2 className="card-title">{name}</h2>
                    <span className="badge">
                        {rating ? `Rating: ${rating}` : 'No rating'}
                    </span>
                </div>
                <p className="card-description">
                    {description}
                </p>
            </div>

            <div className="card-actions">
                <button 
                    className="view-button"
                    onClick={() => onSelect(recipe)}
                >
                    Edit Recipe
                </button>
                <button 
                    className="delete-button"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}