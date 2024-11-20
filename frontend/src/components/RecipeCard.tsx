import React from "react";
import { Recipe } from "../models/entity";
import "./RecipeCard.css";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: (recipe: Recipe | null) => void;
  isSelected: boolean;
}

export function RecipeCard({ recipe, onSelect, isSelected }: RecipeCardProps) {
  const { name, description, rating } = recipe;

  return (
    <div className={`card ${isSelected ? 'card-selected' : ''}`}>
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
          className={`view-button ${isSelected ? 'view-button-active' : ''}`}
          onClick={() => onSelect(isSelected ? null : recipe)}
        >
          {isSelected ? 'Hide Details' : 'View Recipe'}
        </button>
        <button className="like-button" aria-label="Like recipe">
          ❤️
        </button>
      </div>
    </div>
  );
}