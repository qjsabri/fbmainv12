import React, { useState } from 'react';
import { BarChart, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PollCreatorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onCreatePoll?: (options: string[]) => void;
  options?: string[];
  onChange?: (options: string[]) => void;
  onRemove?: () => void;
}

const PollCreator: React.FC<PollCreatorProps> = ({ 
  isOpen, 
  onClose, 
  onCreatePoll,
  options: externalOptions,
  onChange,
  onRemove
}) => {
  const [options, setOptions] = useState<string[]>(externalOptions || ['', '']);
  const [question, setQuestion] = useState('');
  const isStandalone = isOpen !== undefined;

  const handleAddOption = () => {
    if (options.length < 5) {
      const newOptions = [...options, ''];
      setOptions(newOptions);
      onChange?.(newOptions);
    } else {
      toast.info('Maximum 5 options allowed');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
      onChange?.(newOptions);
    } else {
      toast.info('Minimum 2 options required');
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onChange?.(newOptions);
  };

  const handleSubmit = () => {
    // Validate that we have at least 2 non-empty options
    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    if (isStandalone && !question.trim()) {
      toast.error('Please provide a question');
      return;
    }

    // Add question as first element
    if (onCreatePoll) {
      onCreatePoll([question, ...validOptions]);
    }
    
    if (onClose) {
      onClose();
    }
    
    // Reset form
    setOptions(['', '']);
    setQuestion('');
  };

  // For embedded mode (inside CreatePost)
  if (!isStandalone) {
    return (
      <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm mb-1 flex items-center dark:text-gray-200">
            <BarChart className="w-4 h-4 mr-2 text-blue-500" />
            Poll
          </h4>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRemove} 
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-6 text-center text-gray-500 text-sm">{index + 1}.</div>
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1 text-sm h-8 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveOption(index)}
                disabled={options.length <= 2}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        
        {options.length < 5 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="w-full text-xs mt-2 dark:border-gray-600 dark:text-gray-200"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Option
          </Button>
        )}
      </div>
    );
  }

  // Standalone dialog mode
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BarChart className="w-5 h-5 mr-2" />
            Create Poll
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Question</label>
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question..."
              className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Options</label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                    disabled={options.length <= 2}
                    className="h-8 w-8 p-0 dark:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {options.length < 5 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="mt-2 dark:border-gray-600 dark:text-gray-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Option
              </Button>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-gray-200">
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Poll
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PollCreator;