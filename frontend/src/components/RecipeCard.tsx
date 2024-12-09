import React from "react";
import { Recipe } from "../models/entity";
import "./RecipeCard.css";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onCollect: (recipe: Recipe) => void;
}

export function RecipeCard({ recipe, onSelect, onCollect}: RecipeCardProps) {
  const { name, description, rating } = recipe;

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
          🍳 Details
        </button>
        <button className="like-button" aria-label="Like recipe"
          onClick={()=> onCollect(recipe)}>
          ⭐️ Collect
        </button>
      </div>
    </div>
  );
}