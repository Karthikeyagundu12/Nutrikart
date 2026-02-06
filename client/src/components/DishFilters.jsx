import { useState, useRef, useEffect } from 'react';
import './DishFilters.css';

function DishFilters({ onFilterChange, onSortChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSort, setSelectedSort] = useState('relevance'); // 'default' -> 'relevance'
    const [tempSort, setTempSort] = useState('relevance'); // For temporary selection in menu
    const [selectedNutrition, setSelectedNutrition] = useState('all');
    const dropdownRef = useRef(null);

    const sortOptions = [
        { id: 'relevance', label: 'Relevance (Default)' },
        { id: 'delivery_time', label: 'Delivery Time' },
        { id: 'rating', label: 'Rating' },
        { id: 'price_low', label: 'Cost: Low to High' },
        { id: 'price_high', label: 'Cost: High to Low' }
    ];

    const nutritionOptions = [
        { id: 'all', label: 'All Items' },
        { id: 'low_cal', label: 'Low Calorie (<400 cal)' },
        { id: 'high_protein', label: 'High Protein (≥20g)' },
        { id: 'low_carb', label: 'Low Carb (<30g)' },
        { id: 'low_fat', label: 'Low Fat (<15g)' }
    ];

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync tempSort with actual selectedSort when opening
    useEffect(() => {
        if (isOpen) {
            setTempSort(selectedSort);
        }
    }, [isOpen, selectedSort]);

    const handleApply = () => {
        setSelectedSort(tempSort);
        onSortChange(tempSort);
        setIsOpen(false);
    };

    const handleNutritionSelect = (id) => {
        // Toggle logic: if clicking active, revert to all
        const newFilter = selectedNutrition === id ? 'all' : id;
        setSelectedNutrition(newFilter);
        onFilterChange(newFilter);
        // setIsOpen(false); // Valid to keep open to allow sort selection too
    };

    const hasActiveFilters = selectedSort !== 'relevance' || selectedNutrition !== 'all';

    return (
        <div className="dish-filters-wrapper" ref={dropdownRef}>
            <button
                className={`filter-toggle-btn ${hasActiveFilters ? 'active' : ''} ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="icon">⚡</span>
                <span className="label">Filters</span>
                {hasActiveFilters && <span className="dot"></span>}
            </button>

            {isOpen && (
                <div className="filters-popover">
                    <div className="filter-section">
                        <h4>Sort by</h4>
                        <div className="sort-option-list">
                            {sortOptions.map(option => (
                                <div
                                    key={option.id}
                                    className="sort-option-item"
                                    onClick={() => setTempSort(option.id)}
                                >
                                    <span className={`label ${tempSort === option.id ? 'active-text' : ''}`}>{option.label}</span>
                                    <div className={`radio-circle ${tempSort === option.id ? 'selected' : ''}`}>
                                        {tempSort === option.id && <div className="radio-dot"></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="filter-divider"></div>

                    <div className="filter-section">
                        <h4>Nutrition Goals</h4>
                        <div className="chip-group">
                            {nutritionOptions.map(option => (
                                <button
                                    key={option.id}
                                    className={`filter-chip ${selectedNutrition === option.id ? 'active' : ''}`}
                                    onClick={() => handleNutritionSelect(option.id)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="apply-btn" onClick={handleApply}>
                            Apply
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DishFilters;
