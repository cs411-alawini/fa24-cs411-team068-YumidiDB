import React, { useState } from "react";
import { Recipe } from "../models/entity";
import "./RecipeDetail.css";

interface RecipeDetailProps {
  recipe: Recipe;
  onSave: (updatedRecipe: Recipe) => void;
}

export function CollectionRecipeDetail({ recipe: initialRecipe, onSave }: RecipeDetailProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [isEditing, setIsEditing] = useState(false);
  const { name, description, minutes, steps, fat, calories, protein } = recipe;
  const stepsArray = typeof steps === 'string' ? JSON.parse(steps.replace(/'/g, '"')) : steps;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStepsChange = (index: number, value: string) => {
    const newSteps = [...stepsArray];
    newSteps[index] = value;
    setRecipe(prev => ({
      ...prev,
      steps: JSON.stringify(newSteps)
    }));
  };

  const handleSave = () => {
    onSave(recipe);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="recipe-details-card">
        <div className="details-header">
          <h2 className="details-title">{name}</h2>
          <button 
            className="edit-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Recipe
          </button>
        </div>
        
        <div className="details-section">
          <h3>Preparation Time</h3>
          <p>{Math.floor(minutes/60)}h {minutes%60}m</p>
        </div>

        <div className="details-section">
          <h3>Nutrition Information</h3>
          <div className="nutrition-grid">
            <div className="nutrition-item">
              <span>Calories</span>
              <span className="nutrition-value">{calories}</span>
            </div>
            <div className="nutrition-item">
              <span>Fat</span>
              <span className="nutrition-value">{fat}PDV</span>
            </div>
            <div className="nutrition-item">
              <span>Protein</span>
              <span className="nutrition-value">{protein}PDV</span>
            </div>
          </div>
        </div>

        <div className="details-section">
          <h3>Description</h3>
          <p>{description}</p>
        </div>

        <div className="details-section">
          <h3>Instructions</h3>
          <ol className="steps-list">
            {stepsArray.map((step: string, index: number) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-details-card">
      <div className="details-header">
        <input
          name="name"
          value={name}
          onChange={handleInputChange}
          className="edit-title"
          placeholder="Recipe Name"
        />
      </div>
      
      <div className="details-section">
        <h3>Preparation Time</h3>
        <input
          type="number"
          name="minutes"
          value={minutes}
          onChange={handleInputChange}
          className="edit-input"
          min="0"
        />
      </div>

      <div className="details-section">
        <h3>Nutrition Information</h3>
        <div className="nutrition-grid">
          <div className="nutrition-item">
            <span>Calories</span>
            <input
              type="number"
              name="calories"
              value={calories}
              onChange={handleInputChange}
              className="edit-input"
              min="0"
            />
          </div>
          <div className="nutrition-item">
            <span>Fat</span>
            <input
              type="number"
              name="fat"
              value={fat}
              onChange={handleInputChange}
              className="edit-input"
              min="0"
            />
          </div>
          <div className="nutrition-item">
            <span>Protein</span>
            <input
              type="number"
              name="protein"
              value={protein}
              onChange={handleInputChange}
              className="edit-input"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="details-section">
        <h3>Description</h3>
        <textarea
          name="description"
          value={description}
          onChange={handleInputChange}
          className="edit-textarea"
          placeholder="Recipe description"
        />
      </div>

      <div className="details-section">
        <h3>Instructions</h3>
        <ol className="steps-list">
          {stepsArray.map((step: string, index: number) => (
            <li key={index}>
              <textarea
                value={step}
                onChange={(e) => handleStepsChange(index, e.target.value)}
                className="edit-step"
              />
            </li>
          ))}
        </ol>
      </div>

      <div className="edit-actions">
        <button 
          className="cancel-button"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
        <button 
          className="save-button"
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}