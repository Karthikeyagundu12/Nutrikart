import { useEffect } from 'react';
import './NutritionModal.css';

function NutritionModal({ foodItem, isOpen, onClose }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !foodItem) return null;

    const nutrition = foodItem.nutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        fiber: 0
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <div className="modal-header">
                    <img src={foodItem.image} alt={foodItem.name} className="modal-image" />
                    <h2 className="modal-title">{foodItem.name}</h2>
                    <p className="modal-description">{foodItem.description}</p>
                </div>

                <div className="nutrition-section">
                    <h3 className="section-title">📊 Nutrition Information</h3>
                    <p className="nutrition-note">Per serving</p>

                    <div className="nutrition-grid">
                        <div className="nutrition-item calories">
                            <div className="nutrition-icon">🔥</div>
                            <div className="nutrition-details">
                                <span className="nutrition-label">Calories</span>
                                <span className="nutrition-value">{nutrition.calories} kcal</span>
                            </div>
                        </div>

                        <div className="nutrition-item protein">
                            <div className="nutrition-icon">💪</div>
                            <div className="nutrition-details">
                                <span className="nutrition-label">Protein</span>
                                <span className="nutrition-value">{nutrition.protein}g</span>
                            </div>
                        </div>

                        <div className="nutrition-item carbs">
                            <div className="nutrition-icon">🌾</div>
                            <div className="nutrition-details">
                                <span className="nutrition-label">Carbs</span>
                                <span className="nutrition-value">{nutrition.carbs}g</span>
                            </div>
                        </div>

                        <div className="nutrition-item fats">
                            <div className="nutrition-icon">🥑</div>
                            <div className="nutrition-details">
                                <span className="nutrition-label">Fats</span>
                                <span className="nutrition-value">{nutrition.fats}g</span>
                            </div>
                        </div>

                        <div className="nutrition-item fiber">
                            <div className="nutrition-icon">🌿</div>
                            <div className="nutrition-details">
                                <span className="nutrition-label">Fiber</span>
                                <span className="nutrition-value">{nutrition.fiber}g</span>
                            </div>
                        </div>
                    </div>

                    <div className="nutrition-footer">
                        <p className="powered-by">Powered by Spoonacular API</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NutritionModal;
