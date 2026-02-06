import './Filters.css';

function Filters({ activeFilter, onFilterChange }) {
    const filters = [
        { id: 'all', label: 'All', icon: '🍽️' },
        { id: 'Fast Food', label: 'Fast Food', icon: '🍔' },
        { id: 'Indian', label: 'Indian/Veg', icon: '🍛' },
        { id: 'Chinese', label: 'Chinese', icon: '🥡' },
        { id: 'Italian', label: 'Italian', icon: '🍕' },
        { id: 'Healthy', label: 'Healthy', icon: '🥗' },
        { id: 'Dessert', label: 'Desserts', icon: '🍰' }
    ];

    return (
        <div className="filters-container container">
            <div className="filters-scroll">
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        className={`filter-btn ${activeFilter === filter.id ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.id)}
                    >
                        <span className="filter-icon">{filter.icon}</span>
                        <span className="filter-label">{filter.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Filters;
