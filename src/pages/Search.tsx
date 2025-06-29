import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchResults from '@/components/SearchResults';
import AdvancedSearch from '@/components/AdvancedSearch';
import { toast } from 'sonner';

interface SearchFilters {
  query: string;
  type: string;
  dateRange: string;
  location: string;
  author: string;
  timeRange?: [number, number];
  hashtags?: string[];
  contentType?: string[];
}

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    type: searchParams.get('type') || 'all',
    dateRange: searchParams.get('date') || 'any',
    location: searchParams.get('location') || '',
    author: searchParams.get('author') || ''
  });

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showClearHistory, setShowClearHistory] = useState(false);

  // Load search history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('search_history');
      if (savedHistory) {
        setSearchHistory(JSON.parse(savedHistory));
        setShowClearHistory(true);
      }
    } catch (_error) {
      console.error('Error loading search history:', _error);
    }
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    if (filters.query) {
      // Update URL without navigating
      const params = new URLSearchParams();
      params.set('q', filters.query);
      
      if (filters.type !== 'all') params.set('type', filters.type);
      if (filters.dateRange !== 'any') params.set('date', filters.dateRange);
      if (filters.location) params.set('location', filters.location);
      if (filters.author) params.set('author', filters.author);
      
      // Add to search history
      if (!searchHistory.includes(filters.query)) {
        const newHistory = [filters.query, ...searchHistory.slice(0, 9)]; // Keep last 10
        setSearchHistory(newHistory);
        localStorage.setItem('search_history', JSON.stringify(newHistory));
        setShowClearHistory(true);
      }
      
      setSearchParams(params);
    }
  }, [filters, searchParams, setSearchParams, searchHistory]);

  const handleSearch = (newFilters: SearchFilters) => {
    // If only the query changed and it's empty, navigate home
    if (!newFilters.query && filters.query && 
        newFilters.type === filters.type && 
        newFilters.dateRange === filters.dateRange &&
        newFilters.location === filters.location &&
        newFilters.author === filters.author) {
      navigate('/');
      return;
    }
    
    setFilters(newFilters);
    if (newFilters.query) {
      toast.success(`Searching for "${newFilters.query}"`);
    }
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search_history');
    setShowClearHistory(false);
    toast.success('Search history cleared');
  };

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <AdvancedSearch onSearch={handleSearch} />
        <SearchResults />
        
        {/* Clear search history button */}
        {showClearHistory && searchHistory.length > 0 && (
          <div className="flex justify-end mt-3 mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearSearchHistory}
              className="text-gray-500 text-sm dark:text-gray-400"
            >
              Clear Search History
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Button component
const Button = ({ 
  children, 
  variant = "default", 
  size = "default",
  onClick,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  className?: string;

}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors 
        ${size === "sm" ? "text-xs h-8 px-3" : "text-sm h-10 px-4 py-2"} 
        ${variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" : 
          variant === "ghost" ? "hover:bg-accent hover:text-accent-foreground" : 
          variant === "outline" ? "border border-input bg-background hover:bg-accent hover:text-accent-foreground" : 
          variant === "secondary" ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" : 
          variant === "link" ? "underline-offset-4 hover:underline" : 
          "bg-destructive text-destructive-foreground hover:bg-destructive/90"} 
        ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Search;