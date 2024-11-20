import React from "react";
import { Recipe } from "../models/entity";
import "./RecipeDetail.css";

interface RecipeDetailProps {
  recipe: Recipe;
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const { name, description, minutes, steps, fat, calories, protein } = recipe;
  const stepsArray = JSON.parse(steps.replace(/'/g, '"'));

  return (
    <div className="recipe-details-card">
      <h2 className="details-title">{name}</h2>
      
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
            <span className="nutrition-value">{fat}g</span>
          </div>
          <div className="nutrition-item">
            <span>Protein</span>
            <span className="nutrition-value">{protein}g</span>
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