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
    const [isLoading, setIsLoading] = useState(false);
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
            console.log(ingredient);
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRecipe(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const response = await fetch(
                `http://localhost:3007/api/recipes/update/${recipe.customized_id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(recipe),
                }
            );

            if (!response.ok) {
                throw new Error('Failed to update recipe');
            }

            alert('Recipe updated successfully!');
            navigate('/collection');
        } catch (err) {
            alert('Failed to update recipe');
            console.error('Error updating recipe:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="editable-recipe-container">
            <button 
                onClick={() => navigate('/collection')}
                className="back-button"
            >
                ← 
            </button>

            <form onSubmit={handleSubmit} className="recipe-form">
                <h2>Edit Recipe</h2>
                
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

                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={recipe.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={recipe.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Minutes:</label>
                        <input
                            type="number"
                            name="minutes"
                            value={recipe.minutes}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Calories:</label>
                        <input
                            type="number"
                            name="calories"
                            value={recipe.calories}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Fat:</label>
                        <input
                            type="number"
                            name="fat"
                            value={recipe.fat}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Protein:</label>
                        <input
                            type="number"
                            name="protein"
                            value={recipe.protein}
                            onChange={handleChange}
                            min="0"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Steps:</label>
                    <textarea
                        name="steps"
                        value={recipe.steps}
                        onChange={handleChange}
                        required
                        rows={4}
                    />
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={() => navigate('/collection')}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="save-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditableRecipeDetail;