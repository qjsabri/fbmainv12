import React, { useState } from 'react';
import { MapPin, Image, X, Tag, Globe, UsersRound, Lock, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';

interface CreateEventProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent?: (eventData: Omit<Event, 'id' | 'organizer' | 'attendees' | 'interested' | 'comments'>) => void;
}

const CreateEvent: React.FC<CreateEventProps> = ({ isOpen, onClose, onCreateEvent }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    privacy: 'public',
    price: 'Free',
    tags: '',
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Event title is required');
      return;
    }
    
    if (!formData.date) {
      toast.error('Event date is required');
      return;
    }
    
    if (!formData.time) {
      toast.error('Event time is required');
      return;
    }
    
    if (!formData.location.trim()) {
      toast.error('Event location is required');
      return;
    }
    
    if (onCreateEvent) {
      onCreateEvent(formData);
    } else {
      toast.success('Event created successfully!');
    }
    
    onClose();
    resetForm();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = () => {
    setIsUploading(true);
    
    // Simulate image upload
    setTimeout(() => {
      const mockImages = [
        getSafeImage('POSTS', 0),
        getSafeImage('POSTS', 1),
        getSafeImage('POSTS', 2)
      ];
      
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      setFormData(prev => ({ ...prev, image: randomImage }));
      setIsUploading(false);
      toast.success('Cover image uploaded');
    }, 1500);
  };

  const nextStep = () => {
    if (step === 1 && !formData.title.trim()) {
      toast.error('Event title is required');
      return;
    }
    
    if (step === 1 && !formData.date) {
      toast.error('Event date is required');
      return;
    }
    
    if (step === 1 && !formData.time) {
      toast.error('Event time is required');
      return;
    }
    
    if (step === 1 && !formData.location.trim()) {
      toast.error('Event location is required');
      return;
    }
    
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      privacy: 'public',
      price: 'Free',
      tags: '',
      image: ''
    });
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onClose();
    }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Event Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="What's your event called?"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Tell people about your event"
                  rows={3}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Time</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Where is your event?"
                    className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
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
                        alt="Event cover" 
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
                      <p className="text-gray-600 dark:text-gray-400">Upload a cover image for your event</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Category</label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Food">Food & Drink</SelectItem>
                      <SelectItem value="Arts">Arts & Culture</SelectItem>
                      <SelectItem value="Health">Health & Wellness</SelectItem>
                      <SelectItem value="Community">Community</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Privacy</label>
                  <Select value={formData.privacy} onValueChange={(value) => handleInputChange('privacy', value)}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-green-500" />
                          <span>Public</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="friends">
                        <div className="flex items-center">
                          <UsersRound className="w-4 h-4 mr-2 text-blue-500" />
                          <span>Friends</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="private">
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 mr-2 text-red-500" />
                          <span>Private</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Price</label>
                  <Input
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Free or $XX"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Tags</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="music, outdoors, networking"
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">Separate tags with commas</p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 dark:text-blue-400" />
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">About Event Privacy</h4>
                    <p className="text-sm text-blue-700 mt-1 dark:text-blue-200">
                      {formData.privacy === 'public' 
                        ? 'Public events are visible to anyone, and anyone can join or be added.'
                        : formData.privacy === 'friends'
                        ? 'Friends events are only visible to your friends, and only they can join.'
                        : 'Private events are only visible to you and people you invite.'}
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
                  Create Event
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvent;