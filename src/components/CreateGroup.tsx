import React, { useState } from 'react';
import { Globe, Lock, Image, X, Tag, MapPin, Info, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateGroupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateGroup: React.FC<CreateGroupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    privacy: 'public',
    rules: '',
    location: '',
    tags: '',
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    toast.success('Group created successfully!');
    // Group created successfully
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: '',
      privacy: 'public',
      rules: '',
      location: '',
      tags: '',
      image: ''
    });
    setStep(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = () => {
    setIsUploading(true);
    
    // Simulate image upload
    setTimeout(() => {
      const mockImages = [
        'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?w=800&h=600&fit=crop'
      ];
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      
      setFormData(prev => ({ ...prev, image: randomImage }));
      setIsUploading(false);
      toast.success('Cover image uploaded');
    }, 1500);
  };

  const nextStep = () => {
    if (step === 1 && !formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Group Name</label>
                <Input
                  value={formData.name}
                  name="name"
                  onChange={handleInputChange}
                  placeholder="What's your group called?"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Description</label>
                <Textarea
                  value={formData.description}
                  name="description"
                  onChange={handleInputChange}
                  placeholder="What's your group about?"
                  rows={3}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Category</label>
                  <Select name="category" value={formData.category} onValueChange={(value) => setFormData(prev => ({...prev, category: value}))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="hobbies">Hobbies</SelectItem>
                      <SelectItem value="sports">Sports</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="food">Food & Cooking</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="books">Books & Literature</SelectItem>
                      <SelectItem value="outdoors">Outdoors & Nature</SelectItem>
                      <SelectItem value="arts">Arts & Crafts</SelectItem>
                      <SelectItem value="music">Music</SelectItem>
                      <SelectItem value="parenting">Parenting</SelectItem>
                      <SelectItem value="pets">Pets & Animals</SelectItem>
                      <SelectItem value="fashion">Fashion & Style</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="politics">Politics</SelectItem>
                      <SelectItem value="religion">Religion & Spirituality</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Privacy</label>
                  <Select name="privacy" value={formData.privacy} onValueChange={(value) => setFormData(prev => ({...prev, privacy: value}))}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>Public</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center space-x-2">
                          <Lock className="w-4 h-4" />
                          <span>Private</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Cover Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center dark:border-gray-600">
                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto dark:border-gray-700"></div>
                      <p className="text-gray-600 dark:text-gray-400">Uploading image...</p>
                    </div>
                  ) : formData.image ? (
                    <div className="space-y-2">
                      <img 
                        src={formData.image} 
                        alt="Group cover" 
                        className="max-h-40 mx-auto object-contain rounded"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="dark:border-gray-600 dark:text-gray-200"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Image className="w-12 h-12 text-gray-400 mx-auto dark:text-gray-600" />
                      <p className="text-gray-600 dark:text-gray-400">Upload a cover image for your group</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleImageUpload}
                        className="dark:border-gray-600 dark:text-gray-200"
                      >
                        Choose Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium dark:text-gray-200">Group Rules (Optional)</label>
                </div>
                <Textarea
                  value={formData.rules}
                  onChange={(e) => handleInputChange('rules', e.target.value)}
                  placeholder="Set some ground rules for your group. Each rule on a new line."
                  rows={4}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                  Clear rules help create a positive community environment.
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium dark:text-gray-200">Location (Optional)</label>
                </div>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Add a location for your group"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <label className="text-sm font-medium dark:text-gray-200">Tags (Optional)</label>
                </div>
                <Input
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="Add tags separated by commas (e.g., coding, web development)"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                  Tags help people find your group when searching.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">About Group Privacy</h4>
                    <p className="text-sm text-blue-700 mt-1 dark:text-blue-200">
                      {formData.privacy === 'public' 
                        ? 'Public groups are visible to anyone, and anyone can join or be added by a member.'
                        : 'Private groups are only visible to members. People must request to join or be added by an admin or member.'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between space-x-3 pt-4">
            {step === 1 ? (
              <>
                <Button type="button" variant="outline" onClick={onClose} className="dark:border-gray-600 dark:text-gray-200">
                  Cancel
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button type="button" variant="outline" onClick={prevStep} className="dark:border-gray-600 dark:text-gray-200">
                  Back
                </Button>
                <Button type="submit">
                  Create Group
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;