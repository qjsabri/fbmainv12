import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, Smile, MapPin, Users, Calendar, Video, Mic, BarChart, File, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContextType';
import { toast } from 'sonner';
import PollCreator from '../PollCreator';
import GifPicker from '../GifPicker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { memo, useCallback } from 'react';

interface PostData {
  content: string;
  image_url?: string;
  feeling: string;
  location: string;
  tagged_friends: string[];
  privacy: string;
  is_live: boolean;
  isPoll: boolean;
  pollOptions?: string[];
  pollVotes?: Record<string, number>;
}

interface CreatePostProps {
  onCreatePost?: (post: PostData) => void;
}

const CreatePost = memo<CreatePostProps>(({ onCreatePost }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [feeling, setFeeling] = useState('');
  const [location, setLocation] = useState('');
  const [taggedFriends, setTaggedFriends] = useState<string[]>([]);
  const [privacy] = useState('public');
  const [isLive, setIsLive] = useState(false);
  const [isPollCreatorOpen, setIsPollCreatorOpen] = useState(false);
  const [isGifPickerOpen, setIsGifPickerOpen] = useState(false);
  const [isPollActive, setIsPollActive] = useState<boolean>(false);
  const [pollOptions, setPollOptions] = useState<string[]>([]);
  const [isFeelingPickerOpen, setIsFeelingPickerOpen] = useState(false);
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false);
  const [isTaggingOpen, setIsTaggingOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth(); 

  // Optimize event handlers with useCallback
  const handleSubmit = useCallback(async () => {
    if (!content.trim() && selectedImages.length === 0 && !isPollActive) {
      toast.error('Please add some content, images, or create a poll');
      return;
    }
    
    try {
      const postData = {
        content: content.trim(),
        image_url: selectedImages[0], // For now, just use first image
        feeling,
        location,
        tagged_friends: taggedFriends,
        privacy,
        is_live: isLive,
        isPoll: isPollActive,
        pollOptions: isPollActive ? pollOptions : undefined,
        pollVotes: isPollActive ? pollOptions.slice(1).reduce((acc, _, index) => {
          acc[index] = 0;
          return acc;
        }, {} as Record<string, number>) : undefined
      };
      
      if (onCreatePost) {
        onCreatePost(postData);
      }
      
      // Reset form
      setContent('');
      setSelectedImages([]);
      setFeeling('');
      setLocation('');
      setTaggedFriends([]);
      setIsExpanded(false);
      setIsLive(false);
      setIsPollActive(false);
      setPollOptions([]);
      
      toast.success('Post shared successfully!');
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Error creating post:', error);
    }
  }, [content, selectedImages, feeling, location, taggedFriends, privacy, isLive, isPollActive, pollOptions, onCreatePost]);

  const handleExpand = () => {
    setIsExpanded(true);
    // Wait for component to render, then focus
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 50);
  };

  const handleCancel = () => {
    setIsExpanded(false);
    setContent('');
    setSelectedImages([]);
    setFeeling('');
    setLocation('');
    setTaggedFriends([]);
    setIsLive(false);
    setIsPollActive(false);
    setPollOptions([]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Filter and validate files to ensure they are valid File objects
    const validFiles = Array.from(files).filter(file => {
      return Object.prototype.toString.call(file) === '[object File]';
    });
    
    if (validFiles.length === 0) {
      toast.error('No valid files selected');
      setIsUploading(false);
      return;
    }
    
    try {
      // Create object URLs for preview, with proper error handling
      const newImages = validFiles.map(file => {
        try {
          return URL.createObjectURL(file);
        } catch (error) {
          console.error('Error creating object URL for file:', file, error);
          return null;
        }
      }).filter(url => url !== null) as string[];
      
      if (newImages.length > 0) {
        setSelectedImages(prev => [...prev, ...newImages]);
        toast.success(`${newImages.length} image${newImages.length > 1 ? 's' : ''} added!`);
        
        // Auto-expand form when adding images
        if (!isExpanded) {
          setIsExpanded(true);
        }
      } else {
        toast.error('Failed to process selected files');
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process selected files');
    } finally {
      setIsUploading(false);
      
      // Reset the input value so the same file can be selected again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    
    // Validate that we have a valid File object
    const file = files[0];
    if (Object.prototype.toString.call(file) !== '[object File]') {
      toast.error('Invalid file selected');
      setIsUploading(false);
      return;
    }
    
    // Simulate video upload
    toast.info('Video upload started...');

    if (!isExpanded) {
      setIsExpanded(true);
    }
    
    // Simulate processing delay
    setTimeout(() => {
      try {
        const videoUrl = URL.createObjectURL(file);
        setSelectedImages([videoUrl]);
        toast.success('Video ready to post!');
      } catch (error) {
        console.error('Error creating video object URL:', error);
        toast.error('Failed to process video file');
      } finally {
        setIsUploading(false);
      }
    }, 1500);
    
    // Reset the input value
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleImageUpload = () => {
    // Trigger file input click
    fileInputRef.current?.click();
  };

  const handleVideoUpload = () => {
    // Trigger video input click
    videoInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => {
      const newImages = [...prev];
      const removedImage = newImages[index];
      newImages.splice(index, 1);
      
      // Revoke object URL if it was created with URL.createObjectURL
      if (removedImage && removedImage.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(removedImage);
        } catch (error) {
          console.error('Error revoking object URL:', error);
        }
      }
      
      return newImages;
    });
  };

  const handleFeatureClick = (feature: string) => {
    switch (feature) {
      case 'Photo':
        handleImageUpload();
        break;
      case 'Video':
        handleVideoUpload();
        break;
      case 'Tag People':
        setIsTaggingOpen(true);
        break;
      case 'Feeling/Activity':
        setIsFeelingPickerOpen(true);
        break;
      case 'Check In':
        setIsLocationPickerOpen(true);
        break;
      case 'Live Video':
        setIsLive(!isLive);
        toast.info(isLive ? 'Live mode disabled' : 'Live mode enabled');
        break;
      case 'Create Event':
        toast.info(`${feature} feature coming soon!`);
        break;
      case 'Voice Note':
        toast.info(`${feature} feature coming soon!`);
        break;
      case 'Create Poll':
        setIsPollCreatorOpen(true);
        break;
      case 'GIF':
        setIsGifPickerOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCreatePoll = (options: string[]) => {
    setIsPollActive(true);
    setPollOptions(options);
    toast.success('Poll created! Submit your post to share it.');
  };

  const handleSelectGif = (gifUrl: string) => {
    setContent(prev => `${prev} [GIF: ${gifUrl}]`);
    toast.success('GIF added!');
  };

  const handleSelectFeeling = (feeling: string) => {
    setFeeling(feeling);
    setIsFeelingPickerOpen(false);
    toast.success(`Feeling ${feeling} added`);
  };

  const handleSelectLocation = (location: string) => {
    setLocation(location);
    setIsLocationPickerOpen(false);
    toast.success(`Location ${location} added`);
  };

  const handleTagFriend = (friendNames: string[]) => {
    setTaggedFriends(friendNames);
    setIsTaggingOpen(false);
    toast.success(`Tagged ${friendNames.length} friend${friendNames.length !== 1 ? 's' : ''}`);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedImages.forEach(image => {
        if (image.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(image);
          } catch (error) {
            console.error('Error revoking object URL:', error);
          }
        }
      });
    };
  }, [selectedImages]);

  if (!user) return null;

  return (<>
      <Card className="card-responsive bg-white shadow-sm border-0 shadow-gray-100 mb-4 dark:bg-gray-800 dark:shadow-gray-900">
        <CardContent className="spacing-responsive">
          <div className="flex space-x-3">
            <Avatar className="avatar-responsive">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              {!isExpanded ? (
                <button
                  onClick={handleExpand}
                  className="w-full text-left p-2 sm:p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors text-responsive-sm touch-target dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
                  {(feeling || location || taggedFriends.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {feeling && (
                        <div className="inline-flex items-center space-x-1 text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full dark:bg-blue-900/20 dark:text-blue-400">
                          <span>Feeling {feeling}</span>
                          <button onClick={() => setFeeling('')} className="text-gray-500 hover:text-gray-700">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {location && (
                        <div className="inline-flex items-center space-x-1 text-sm bg-green-50 text-green-600 px-2 py-1 rounded-full dark:bg-green-900/20 dark:text-green-400">
                          <MapPin className="w-3 h-3" />
                          <span>{location}</span>
                          <button onClick={() => setLocation('')} className="text-gray-500 hover:text-gray-700">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {taggedFriends.length > 0 && (
                        <div className="inline-flex items-center space-x-1 text-sm bg-purple-50 text-purple-600 px-2 py-1 rounded-full dark:bg-purple-900/20 dark:text-purple-400">
                          <Users className="w-3 h-3" />
                          <span>with {taggedFriends.length} {taggedFriends.length === 1 ? 'person' : 'people'}</span>
                          <button onClick={() => setTaggedFriends([])} className="text-gray-500 hover:text-gray-700">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image Preview */}
                  {selectedImages.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-6 h-6 p-0"
                          >
                            <span className="sr-only">Remove</span>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Poll Preview */}
                  {isPollActive && pollOptions.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded-lg dark:bg-gray-700">
                      <h4 className="font-medium text-sm mb-2 dark:text-gray-200">{pollOptions[0]}</h4>
                      <div className="space-y-2">
                        {pollOptions.slice(1).map((option, index) => (
                          <div 
                            key={index}
                            className="p-2 border border-gray-200 rounded-lg dark:border-gray-600 dark:text-gray-200"
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File input for photo upload */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                    accept="image/*"
                    multiple
                  />

                  {/* File input for video upload */}
                  <input
                    type="file"
                    ref={videoInputRef}
                    onChange={handleVideoSelect}
                    className="hidden"
                    accept="video/*"
                  />

                  {/* Enhanced Quick Actions */}
                  <div className="flex flex-wrap gap-2 py-2 border-t border-gray-100 dark:border-gray-700">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-600 h-auto py-2 px-3 dark:text-green-400"
                      onClick={() => handleFeatureClick('Photo')}
                      disabled={isUploading}
                    >
                      <Image className="w-4 h-4 mr-1" />
                      <span className="text-xs">Photo</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 h-auto py-2 px-3 dark:text-red-400"
                      onClick={() => handleFeatureClick('Video')}
                      disabled={isUploading}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      <span className="text-xs">Video</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-600 h-auto py-2 px-3 dark:text-blue-400"
                      onClick={() => handleFeatureClick('Tag People')}
                    >
                      <Users className="w-4 h-4 mr-1" />
                      <span className="text-xs">Tag People</span>
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
                      className="text-red-600 h-auto py-2 px-3 dark:text-red-400"
                      onClick={() => handleFeatureClick('Check In')}
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-xs">Check In</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-auto py-2 px-3 ${isLive ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20' : 'text-purple-600 dark:text-purple-400'}`}
                      onClick={() => handleFeatureClick('Live Video')}
                    >
                      <Video className="w-4 h-4 mr-1" />
                      <span className="text-xs">Live Video</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-orange-600 h-auto py-2 px-3 dark:text-orange-400"
                      onClick={() => handleFeatureClick('Create Event')}
                    >
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-xs">Event</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-auto py-2 px-3 ${isPollActive ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' : 'text-blue-600 dark:text-blue-400'}`}
                      onClick={() => handleFeatureClick('Create Poll')}
                    >
                      <BarChart className="w-4 h-4 mr-1" />
                      <span className="text-xs">Poll</span>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-pink-600 h-auto py-2 px-3 dark:text-pink-400"
                      onClick={() => handleFeatureClick('GIF')}
                    >
                      <File className="w-4 h-4 mr-1" />
                      <span className="text-xs">GIF</span>
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 dark:text-gray-300"
                      onClick={() => handleFeatureClick('Voice Note')}
                    >
                      <Mic className="w-4 h-4 mr-1" />
                      <span className="text-xs">Voice Note</span>
                    </Button>
                    
                    <div className="flex space-x-2 self-end sm:self-auto">
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

          {/* Quick Actions for collapsed state */}
          {!isExpanded && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex space-x-1 sm:space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-600 flex-1 sm:flex-none dark:text-red-400"
                  onClick={() => handleFeatureClick('Live Video')}
                >
                  <Video className="w-4 h-4 mr-1" />
                  <span className="text-xs">Live video</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-green-600 flex-1 sm:flex-none dark:text-green-400"
                  onClick={() => handleFeatureClick('Photo')}
                >
                  <Image className="w-4 h-4 mr-1" />
                  <span className="text-xs">Photo</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-yellow-600 flex-1 sm:flex-none dark:text-yellow-400"
                  onClick={() => handleFeatureClick('Feeling/Activity')}
                >
                  <Smile className="w-4 h-4 mr-1" />
                  <span className="text-xs">Feeling</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Poll Creator Dialog */}
      <PollCreator 
        isOpen={isPollCreatorOpen}
        onClose={() => setIsPollCreatorOpen(false)}
        onCreatePoll={handleCreatePoll}
      />

      {/* GIF Picker Dialog */}
      <GifPicker
        isOpen={isGifPickerOpen}
        onClose={() => setIsGifPickerOpen(false)}
        onSelectGif={handleSelectGif}
      />

      {/* Feeling Picker */}
      <Dialog open={isFeelingPickerOpen} onOpenChange={setIsFeelingPickerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How are you feeling?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2 p-2">
            {['😊 Happy', '😢 Sad', '😍 Loved', '😎 Cool', '🤔 Thoughtful', '😂 Amused', 
              '😴 Sleepy', '😡 Angry', '🥳 Celebrating'].map(emoji => (
              <Button 
                key={emoji} 
                variant="outline" 
                onClick={() => handleSelectFeeling(emoji)}
                className="h-auto py-4 justify-start dark:border-gray-600 dark:text-gray-200"
              >
                <span className="text-xl mr-2">{emoji.split(' ')[0]}</span>
                <span>{emoji.split(' ')[1]}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Picker */}
      <Dialog open={isLocationPickerOpen} onOpenChange={setIsLocationPickerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Where are you?</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 p-2">
            {['San Francisco, CA', 'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Seattle, WA', 
              'Boston, MA', 'Austin, TX', 'Miami, FL'].map(place => (
              <Button 
                key={place} 
                variant="outline" 
                onClick={() => handleSelectLocation(place)}
                className="justify-start dark:border-gray-600 dark:text-gray-200"
              >
                <MapPin className="mr-2 h-4 w-4" />
                {place}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Tag People */}
      <Dialog open={isTaggingOpen} onOpenChange={setIsTaggingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tag people in your post</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-2 p-2">
            {[
              { name: 'Sarah Johnson', avatar: MOCK_IMAGES.AVATARS[0] },
              { name: 'Mike Chen', avatar: MOCK_IMAGES.AVATARS[1] },
              { name: 'Emma Wilson', avatar: getSafeImage('AVATARS', 2) },
              { name: 'David Kim', avatar: getSafeImage('AVATARS', 3) },
              { name: 'Lisa Wang', avatar: getSafeImage('AVATARS', 4) }
            ].map((friend, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md dark:hover:bg-gray-800">
                <input 
                  type="checkbox" 
                  id={`friend-${index}`}
                  checked={taggedFriends.includes(friend.name)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setTaggedFriends(prev => [...prev, friend.name]);
                    } else {
                      setTaggedFriends(prev => prev.filter(name => name !== friend.name));
                    }
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.avatar} />
                  <AvatarFallback>{friend.name[0]}</AvatarFallback>
                </Avatar>
                <label htmlFor={`friend-${index}`} className="flex-1 cursor-pointer dark:text-gray-200">
                  {friend.name}
                </label>
              </div>
            ))}
            <Button 
              onClick={() => handleTagFriend(taggedFriends)} 
              className="mt-4"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

CreatePost.displayName = 'CreatePost';

export default CreatePost;