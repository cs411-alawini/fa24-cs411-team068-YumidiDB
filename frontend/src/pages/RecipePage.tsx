import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RecipeDetail } from '../components/RecipeDetail';
import './styles/RecipePage.css'

const RecipePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const recipe = location.state?.recipe;

    if (!recipe) {
        return (
            <div className="not-found-container">
                <p>Recipe not found</p>
                <button 
                    onClick={() => navigate(-1)} 
                    className="back-button"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="recipe-page-container">
            <button 
                onClick={() => navigate(-1)} 
                className="back-button"
            >
                ← 
            </button>
            <RecipeDetail recipe={recipe} />
        </div>
    );
};

export default RecipePage;