import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface GifPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGif: (gifUrl: string) => void;
}

const GifPicker: React.FC<GifPickerProps> = ({ isOpen, onClose, onSelectGif }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);

  // Mock GIF data
  const mockGifs = useMemo(() => [
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2E2cWF1NXJ1ZWdxbWF6bXd0NnJ5aHgydWs2aWJlcWQyaXV0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjHAUOqG3lSS0f1C/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2E2cWF1NXJ1ZWdxbWF6bXd0NnJ5aHgydWs2aWJlcWQyaXV0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlHFRbmaZtBRhXG/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2E2cWF1NXJ1ZWdxbWF6bXd0NnJ5aHgydWs2aWJlcWQyaXV0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l46CyJmS9N5q8uQM0/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2E2cWF1NXJ1ZWdxbWF6bXd0NnJ5aHgydWs2aWJlcWQyaXV0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4FGlzJQPFAymOH5e/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2E2cWF1NXJ1ZWdxbWF6bXd0NnJ5aHgydWs2aWJlcWQyaXV0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0MYt5jPR6QX5pnqM/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2E2cWF1NXJ1ZWdxbWF6bXd0NnJ5aHgydWs2aWJlcWQyaXV0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlQXlQ3nHyLMvte/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2E2cWF1NXJ1ZWdxbWF6bXd0NnJ5aHgydWs2aWJlcWQyaXV0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlGRDhPTqVEvhCw/giphy.gif',
    'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDd6Y2E2cWF1NXJ1ZWdxbWF6bXd0NnJ5aHgydWs2aWJlcWQyaXV0eCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlKrB02QY0f1mbm/giphy.gif'
  ], []);

  // Load trending GIFs on initial load
  React.useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setGifs(mockGifs);
        setIsLoading(false);
      }, 500);
    }
  }, [isOpen, mockGifs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    // Simulate API call with search term
    setTimeout(() => {
      // Shuffle the mock GIFs to simulate different search results
      const shuffled = [...mockGifs].sort(() => 0.5 - Math.random());
      setGifs(shuffled.slice(0, 6));
      setIsLoading(false);
    }, 500);
  };

  const handleSelectGif = (gifUrl: string) => {
    setSelectedGif(gifUrl);
  };

  const handleConfirm = () => {
    if (selectedGif) {
      onSelectGif(selectedGif);
      onClose();
    } else {
      toast.error('Please select a GIF');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select a GIF</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="mt-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search GIFs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </form>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {gifs.map((gif, index) => (
                <div 
                  key={index} 
                  className={`relative rounded overflow-hidden cursor-pointer ${
                    selectedGif === gif ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleSelectGif(gif)}
                >
                  <img 
                    src={gif} 
                    alt={`GIF ${index + 1}`} 
                    className="w-full h-32 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
          
          {gifs.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No GIFs found. Try a different search term.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-gray-200">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedGif}>
            Insert GIF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GifPicker;