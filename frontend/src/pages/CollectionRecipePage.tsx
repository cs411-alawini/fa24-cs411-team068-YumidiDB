import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Recipe } from '../models/entity';
// import './styles/CollectionRecipePage.css';

const EditableRecipeDetail: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const initialRecipe = location.state?.recipe;
    const [recipe, setRecipe] = useState<Recipe>(initialRecipe);
    const [isLoading, setIsLoading] = useState(false);

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
                `http://localhost:3007/api/recipes/update/${recipe.recipe_id}`,
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
                ← Back to Collection
            </button>

            <form onSubmit={handleSubmit} className="recipe-form">
                <h2>Edit Recipe</h2>
                
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