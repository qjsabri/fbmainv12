import React, { useState } from 'react';
import { BarChart, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PollCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (options: string[]) => void;
}

const PollCreator: React.FC<PollCreatorProps> = ({ isOpen, onClose, onCreatePoll }) => {
  const [options, setOptions] = useState<string[]>(['', '']);
  const [question, setQuestion] = useState('');

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    } else {
      toast.info('Maximum 5 options allowed');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = [...options];
      newOptions.splice(index, 1);
      setOptions(newOptions);
    } else {
      toast.info('Minimum 2 options required');
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    // Validate that we have at least 2 non-empty options
    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    if (!question.trim()) {
      toast.error('Please provide a question');
      return;
    }

    // Add question as first element
    onCreatePoll([question, ...validOptions]);
    onClose();
    
    // Reset form
    setOptions(['', '']);
    setQuestion('');
  };

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