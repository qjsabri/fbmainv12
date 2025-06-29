import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, Video, Smile, Users, Mic, MapPin, X, Gift, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import PollCreator from '../PollCreator';
import GifPicker from '../GifPicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MOCK_IMAGES } from '@/lib/constants';
import { useCallback, memo } from 'react';

interface PostData {
  content: string;
  images?: string[];
  feeling?: string;
  location?: string;
  taggedFriends?: string[];
  isLive?: boolean;
  poll?: {
    question: string;
    options: string[];
  };
}

interface CreatePostProps {
  onCreatePost?: (post: PostData) => void;
}

const CreatePost: React.FC<CreatePostProps> = memo(({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [taggedFriends, setTaggedFriends] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isPollActive, setIsPollActive] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  
  const { user } = useAuth(); 

  const handleSubmit = useCallback(async () => {
    if (!content.trim() && selectedImages.length === 0 && !isPollActive) {
      toast.error('Please add some content, images, or create a poll');
      return;
    }

    if (isPollActive && pollOptions.length < 3) {
      toast.error('Poll must have at least 3 options');
      return;
    }

    try {
      const postData: PostData = {
        content: content.trim(),
        images: selectedImages.length > 0 ? selectedImages : undefined,
        feeling: feeling || undefined,
        location: location || undefined,
        taggedFriends: taggedFriends.length > 0 ? taggedFriends : undefined,
        isLive,
        poll: isPollActive ? {
          question: content.trim(),
          options: pollOptions
        } : undefined
      };

      if (onCreatePost) {
        onCreatePost(postData);
      }

      // Reset form
      handleCancel();
      toast.success('Post shared successfully!');
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Error creating post:', error);
    }
  }, [content, selectedImages, feeling, location, taggedFriends, isLive, isPollActive, pollOptions, onCreatePost]);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    // Wait for component to render, then focus
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 50);
  }, []);

  const handleCancel = useCallback(() => {
    setIsExpanded(false);
    setContent('');
    setSelectedImages([]);
    setFeeling('');
    setLocation('');
    setTaggedFriends([]);
    setIsLive(false);
    setIsPollActive(false);
    setPollOptions([]);
  }, []);

  // Memory cleanup for object URLs
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => {
        if (image.startsWith('blob:')) {
          URL.revokeObjectURL(image);
        }
      });
    };
  }, [selectedImages]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      }
    });

    setSelectedImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const imageToRemove = selectedImages[index];
    if (imageToRemove.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove);
    }
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleFeatureClick = (feature: string) => {
    switch (feature) {
      case 'Photo':
        document.getElementById('image-upload')?.click();
        break;
      case 'Live Video':
        setIsLive(!isLive);
        if (!isExpanded) setIsExpanded(true);
        break;
      case 'Feeling/Activity':
        setFeeling(feeling ? '' : 'happy');
        if (!isExpanded) setIsExpanded(true);
        break;
      case 'Tag People':
        // Mock tagging functionality
        setTaggedFriends(prev => 
          prev.length > 0 ? [] : ['John Doe', 'Jane Smith']
        );
        if (!isExpanded) setIsExpanded(true);
        break;
      case 'Voice Note':
        toast.info('Voice note feature coming soon!');
        break;
      case 'Poll':
        setIsPollActive(!isPollActive);
        if (!isPollActive) {
          setPollOptions(['Option 1', 'Option 2', 'Option 3']);
        } else {
          setPollOptions([]);
        }
        if (!isExpanded) setIsExpanded(true);
        break;
      case 'GIF':
        setShowGifPicker(true);
        break;
      default:
        toast.info(`${feature} feature coming soon!`);
    }
  };

  const handleGifSelect = (gifUrl: string) => {
    setSelectedImages(prev => [...prev, gifUrl]);
    setShowGifPicker(false);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Card className="card-responsive bg-white shadow-sm border-0 shadow-gray-100 mb-4 dark:bg-gray-800 dark:shadow-gray-900 overflow-hidden">
        <CardContent className="spacing-responsive">
          <div className="flex space-x-3">
            <Avatar className="avatar-responsive">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              {!isExpanded ? (
                <button
                  onClick={handleExpand}
                  className="w-full text-left p-2 sm:p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors text-xs sm:text-sm touch-target dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  What's on your mind, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}?
                </button>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    placeholder={`What's on your mind, ${user.user_metadata?.full_name?.split(' ')[0] || 'there'}?`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border-0 resize-none focus:ring-0 text-sm sm:text-base p-0 min-h-[60px] sm:min-h-[100px] dark:bg-gray-800 dark:text-gray-100"
                    autoFocus
                  />

                  {/* Status indicators */}
                  <div className="flex flex-wrap gap-2">
                    {isLive && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        🔴 Going Live
                      </span>
                    )}
                    {feeling && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        😊 Feeling {feeling}
                      </span>
                    )}
                    {location && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        📍 {location}
                      </span>
                    )}
                    {taggedFriends.length > 0 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        👥 with {taggedFriends.join(', ')}
                      </span>
                    )}
                  </div>

                  {/* Image Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 sm:h-40 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Poll Creator */}
                  {isPollActive && (
                    <PollCreator
                      options={pollOptions}
                      onChange={setPollOptions}
                      onRemove={() => {
                        setIsPollActive(false);
                        setPollOptions([]);
                      }}
                    />
                  )}

                  {/* Hidden file input */}
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Enhanced Quick Actions */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 py-2 border-t border-gray-100 dark:border-gray-700">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-600 h-auto py-1.5 px-2 sm:py-2 sm:px-3 text-xs dark:text-green-400"
                      onClick={() => handleFeatureClick('Photo')}
                      disabled={isUploading}
                    >
                      <Image className="w-4 h-4 mr-1" />
                      <span className="text-xs">Photo</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 h-auto py-1.5 px-2 sm:py-2 sm:px-3 text-xs dark:text-blue-400"
                      onClick={() => handleFeatureClick('Tag People')}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-xs">Tag</span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-yellow-600 h-auto py-2 px-3 dark:text-yellow-400"
                      onClick={() => handleFeatureClick('Feeling/Activity')}
                    >
                      <Smile className="w-4 h-4 mr-1" />
                      <span className="text-xs">Feeling</span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-600 h-auto py-2 px-3 dark:text-purple-400"
                      onClick={() => handleFeatureClick('Poll')}
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      <span className="text-xs">Poll</span>
                    </Button>

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-pink-600 h-auto py-2 px-3 dark:text-pink-400"
                      onClick={() => handleFeatureClick('GIF')}
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      <span className="text-xs">GIF</span>
                    </Button>
                  </div>

                  {/* Submit Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 text-xs dark:text-gray-300"
                      onClick={() => handleFeatureClick('Voice Note')}
                    >
                      <Mic className="w-4 h-4 mr-1" />
                      Voice Note
                    </Button>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="h-8 dark:border-gray-600 dark:text-gray-200"
                        onClick={handleCancel}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        className="h-8"
                        onClick={handleSubmit}
                        disabled={(!content.trim() && selectedImages.length === 0 && !isPollActive) || 
                                 (isPollActive && pollOptions.length < 3) || isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Post'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions for collapsed state - Optimized for mobile */}
          {!isExpanded && (
            <div className="flex items-center justify-around sm:justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-600 py-1 px-2 sm:py-2 sm:px-3 text-xs dark:text-red-400"
                onClick={() => handleFeatureClick('Live Video')}
              >
                <Video className="w-4 h-4 mr-1" />
                <span className="text-xs">Live</span>
              </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-600 py-1 px-2 sm:py-2 sm:px-3 text-xs dark:text-green-400"
                  onClick={() => handleFeatureClick('Photo')}
                >
                  <Image className="w-4 h-4 mr-1" />
                  <span className="text-xs">Photo</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-yellow-600 py-1 px-2 sm:py-2 sm:px-3 text-xs dark:text-yellow-400"
                  onClick={() => handleFeatureClick('Feeling/Activity')}
                >
                  <Smile className="w-4 h-4 mr-1" />
                  <span className="text-xs">Feeling</span>
                </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GIF Picker Dialog */}
      <Dialog open={showGifPicker} onOpenChange={setShowGifPicker}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Choose a GIF</DialogTitle>
          </DialogHeader>
          <GifPicker onSelect={handleGifSelect} />
        </DialogContent>
      </Dialog>
    </>
  );
});

CreatePost.displayName = 'CreatePost';

export default CreatePost;