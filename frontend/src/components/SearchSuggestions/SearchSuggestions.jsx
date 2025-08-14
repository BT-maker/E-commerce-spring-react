import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import './SearchSuggestions.css';

const SearchSuggestions = ({ onSearch, placeholder = "Ürün, kategori veya mağaza ara...", compact = false }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [popularTerms, setPopularTerms] = useState([]);
    const searchRef = useRef(null);
    const suggestionsRef = useRef(null);

    // Debounce için timeout
    const [debounceTimeout, setDebounceTimeout] = useState(null);

    // Popüler arama terimlerini yükle
    useEffect(() => {
        fetchPopularTerms();
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target) &&
                suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchPopularTerms = async () => {
        try {
            const response = await fetch('http://localhost:8082/api/search-suggestions/popular?limit=8');
            if (response.ok) {
                const data = await response.json();
                setPopularTerms(data);
            }
        } catch (error) {
            console.error('Popüler terimler yüklenirken hata:', error);
        }
    };

    const fetchSuggestions = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8082/api/search-suggestions/general?query=${encodeURIComponent(searchQuery)}&limit=8`);
            if (response.ok) {
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(data.length > 0);
            }
        } catch (error) {
            console.error('Öneriler yüklenirken hata:', error);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        // Debounce - 300ms bekle
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        const timeout = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);

        setDebounceTimeout(timeout);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
        onSearch(suggestion);
    };

    const handlePopularTermClick = (term) => {
        setQuery(term);
        setShowSuggestions(false);
        onSearch(term);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setShowSuggestions(false);
            onSearch(query);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    return (
        <div className="header-search-suggestions-container" ref={searchRef}>
            <form onSubmit={handleSubmit} className="header-search-form">
                <div className="header-search-input-wrapper">
                    <Search className="header-search-icon" size={16} />
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="header-search-input"
                        autoComplete="off"
                    />
                    {loading && (
                        <div className="loading-spinner">
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>
                {!compact && (
                    <button type="submit" className="header-search-button">
                        Ara
                    </button>
                )}
            </form>

            {/* Öneriler Dropdown */}
            {showSuggestions && (
                <div className="suggestions-dropdown" ref={suggestionsRef}>
                    {suggestions.length > 0 ? (
                        <div className="suggestions-list">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    <Search size={16} className="suggestion-icon" />
                                    <span>{suggestion}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-suggestions">
                            <p>Öneri bulunamadı</p>
                        </div>
                    )}
                </div>
            )}

            {/* Popüler Arama Terimleri */}
            {!showSuggestions && !query && popularTerms.length > 0 && !compact && (
                <div className="popular-terms">
                    <h4>Popüler Aramalar</h4>
                    <div className="popular-terms-list">
                        {popularTerms.map((term, index) => (
                            <button
                                key={index}
                                className="popular-term-chip"
                                onClick={() => handlePopularTermClick(term)}
                            >
                                {term}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchSuggestions; 