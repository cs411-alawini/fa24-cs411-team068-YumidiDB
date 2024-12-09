import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CustomizedRecipe } from '../models/entity';
import './styles/CollectionRecipePage.css';

interface Ingredient {
    ingredient_id: number;
    ingredient_name: string;
    amount: number;
    unit: string;
}

const EditableRecipeDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialRecipe = location.state?.recipe;
    const [recipe, setRecipe] = useState<CustomizedRecipe>(initialRecipe);
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [editingIngredient, setEditingIngredient] = useState<number | null>(null);
    const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);

    if (!recipe) {
        return (
            <div className="recipe-not-found">
                <h2>Recipe not found</h2>
                <button onClick={() => navigate('/collection')}>
                    Back to Collection
                </button>
            </div>
        );
    }

    useEffect(() => {
        if (recipe) {
            fetchIngredients();
        }
    }, [recipe]);

    const handleIngredientUpdate = async (ingredient: Ingredient) => {
        try {
            const response = await fetch('http://localhost:3007/api/collection/updateIngredient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    customized_id: recipe.customized_id,
                    ingredient_id: ingredient.ingredient_id,
                    amount: ingredient.amount,
                    unit: ingredient.unit
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update ingredient');
            }

            await fetchIngredients();
            setEditingIngredient(null);
            alert('Ingredient updated successfully!');
        } catch (err) {
            console.error('Error updating ingredient:', err);
            alert('Failed to update ingredient');
        }
    };

    const handleIngredientChange = (ingredient: Ingredient, field: 'amount' | 'unit', value: string) => {
        const updatedIngredients = ingredients.map(ing => {
            if (ing.ingredient_id === ingredient.ingredient_id) {
                return {
                    ...ing,
                    [field]: field === 'amount' ? Number(value) : value
                };
            }
            return ing;
        });
        setIngredients(updatedIngredients);
    };

    const fetchIngredients = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3007/api/collection/getIngredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    customized_id: recipe?.customized_id
                })
            });
            if (!response.ok) {
                throw new Error('Failed to fetch ingredients');
            }

            const data = await response.json();
            const mappedIngredients = data.map((ing: any) => ({
                ingredient_id: ing.ingredient_id,
                ingredient_name: ing.ingredient_name,
                amount: ing.ingredient_amount,
                unit: ing.ingredient_unit
            }));
            setIngredients(mappedIngredients);
        } catch (err) {
            console.error('Error fetching ingredients:', err);
        } finally {
            setIsLoadingIngredients(false);
        }
    }, [recipe?.customized_id]);

    useEffect(() => {
        if (recipe) {
            fetchIngredients();
        }
    }, [recipe, fetchIngredients]);

    return (
        <div className="editable-recipe-container">
            <button 
                onClick={() => navigate('/collection')}
                className="back-button"
            >
                ←
            </button>

            <div className="recipe-form">
                <h2>{recipe.name}</h2>
                
                <div className="form-group ingredients-section">
                    <h3>Ingredients</h3>
                    {isLoadingIngredients ? (
                        <div className="loading-ingredients">Loading ingredients...</div>
                    ) : ingredients.length > 0 ? (
                        <div className="ingredients-list">
                            {ingredients.map((ingredient) => (
                                <div key={ingredient.ingredient_id} className="ingredient-item">
                                    <span className="ingredient-name">
                                        {ingredient.ingredient_name}
                                    </span>
                                    {editingIngredient === ingredient.ingredient_id ? (
                                        <div className="ingredient-edit">
                                            <input
                                                type="number"
                                                value={ingredient.amount}
                                                onChange={(e) => handleIngredientChange(ingredient, 'amount', e.target.value)}
                                                className="amount-input"
                                                min="0"
                                                step="0.1"
                                            />
                                            <input
                                                type="text"
                                                value={ingredient.unit}
                                                onChange={(e) => handleIngredientChange(ingredient, 'unit', e.target.value)}
                                                className="unit-input"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => handleIngredientUpdate(ingredient)}
                                                className="save-ingredient"
                                            >
                                                Save
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => setEditingIngredient(null)}
                                                className="cancel-ingredient"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="ingredient-actions">
                                            <span className="ingredient-amount">
                                                {ingredient.amount} {ingredient.unit}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setEditingIngredient(ingredient.ingredient_id)}
                                                className="edit-ingredient"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-ingredients">No ingredients found</p>
                    )}
                </div>

                <div className="details-section">
                    <div className="detail-group">
                        <h3>Description</h3>
                        <p>{recipe.description}</p>
                    </div>

                    <div className="detail-row">
                        <div className="detail-group">
                            <h3>Preparation Time</h3>
                            <p>{Math.floor(recipe.minutes/60)}h {recipe.minutes%60}m</p>
                        </div>

                        <div className="detail-group">
                            <h3>Calories</h3>
                            <p>{recipe.calories}</p>
                        </div>
                    </div>

                    <div className="detail-row">
                        <div className="detail-group">
                            <h3>Fat</h3>
                            <p>{recipe.fat} PDV</p>
                        </div>

                        <div className="detail-group">
                            <h3>Protein</h3>
                            <p>{recipe.protein} PDV</p>
                        </div>
                    </div>

                    <div className="detail-group">
                        <h3>Steps</h3>
                        <ol className="steps-list">
                            {JSON.parse(recipe.steps.replace(/'/g, '"')).map((step: string, index: number) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditableRecipeDetail;