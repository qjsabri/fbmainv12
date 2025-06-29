import React, { useState, useRef } from 'react';
import { Camera, Video, Type, X, Image as ImageIcon, Palette, Sliders, Globe, Users, Lock, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface StoryData {
  type: 'photo' | 'video' | 'text';
  media?: string;
  content: string;
  background?: string;
  textColor: string;
  fontSize: number;
  textAlignment: string;
  privacy: 'public' | 'friends' | 'close-friends';
  duration: number;
  timestamp: string;
}

interface StoryCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateStory: (storyData: StoryData) => void;
}

const StoryCreator: React.FC<StoryCreatorProps> = ({ isOpen, onClose, onCreateStory }) => {
  const [storyType, setStoryType] = useState<'photo' | 'video' | 'text'>('photo');
  const [storyContent, setStoryContent] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('gradient-1');
  const [textColor, setTextColor] = useState('white');
  const [fontSize, setFontSize] = useState([16]);
  const [textAlignment, setTextAlignment] = useState('center');
  const [selectedImage, setSelectedImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'close-friends'>('friends');
  const [duration, setDuration] = useState<'24h' | '12h' | '6h' | 'custom'>('24h');
  const [customHours, setCustomHours] = useState([24]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const backgrounds = [
    { id: 'gradient-1', name: 'Blue to Purple', class: 'bg-gradient-to-br from-blue-500 to-purple-600' },
    { id: 'gradient-2', name: 'Green to Blue', class: 'bg-gradient-to-br from-green-400 to-blue-500' },
    { id: 'gradient-3', name: 'Red to Orange', class: 'bg-gradient-to-br from-red-500 to-orange-500' },
    { id: 'gradient-4', name: 'Purple to Pink', class: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { id: 'solid-1', name: 'Blue', class: 'bg-blue-600' },
    { id: 'solid-2', name: 'Green', class: 'bg-green-600' },
    { id: 'solid-3', name: 'Red', class: 'bg-red-600' },
    { id: 'solid-4', name: 'Black', class: 'bg-black' },
  ];

  const colors = [
    { id: 'white', name: 'White', class: 'text-white' },
    { id: 'black', name: 'Black', class: 'text-black' },
    { id: 'yellow', name: 'Yellow', class: 'text-yellow-400' },
    { id: 'blue', name: 'Blue', class: 'text-blue-400' },
    { id: 'green', name: 'Green', class: 'text-green-400' },
    { id: 'red', name: 'Red', class: 'text-red-400' },
  ];

  const alignments = [
    { id: 'left', name: 'Left', class: 'text-left' },
    { id: 'center', name: 'Center', class: 'text-center' },
    { id: 'right', name: 'Right', class: 'text-right' },
  ];

  const resetForm = () => {
    setStoryType('photo');
    setStoryContent('');
    setSelectedBackground('gradient-1');
    setTextColor('white');
    setFontSize([16]);
    setTextAlignment('center');
    setSelectedImage('');
    setVideoUrl('');
    setPrivacy('friends');
    setDuration('24h');
    setCustomHours([24]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 10MB.');
      return;
    }
    
    setIsUploading(true);
    
    // Create a URL for the image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast.error('Error reading file');
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 50MB.');
      return;
    }
    
    setIsUploading(true);
    
    // Create a URL for the video preview
    const videoURL = URL.createObjectURL(file);
    setVideoUrl(videoURL);
    setIsUploading(false);
    
    // Mock a thumbnail using the video
    const video = document.createElement('video');
    video.src = videoURL;
    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg');
        setSelectedImage(thumbnail);
      }
    });
  };

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleSelectVideo = () => {
    videoInputRef.current?.click();
  };

  const handleRemoveMedia = () => {
    setSelectedImage('');
    setVideoUrl('');
    
    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const simulateImageUpload = () => {
    setIsUploading(true);
    
    // Simulate image upload
    setTimeout(() => {
      const mockImages = [
        'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?w=800&h=600&fit=crop',
        'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?w=800&h=600&fit=crop'
      ];
      
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      setSelectedImage(randomImage);
      setIsUploading(false);
      toast.success('Image uploaded successfully');
    }, 1500);
  };

  const handleCreateStory = () => {
    // Validate based on story type
    if (storyType === 'text' && !storyContent.trim()) {
      toast.error('Please add some text to your story');
      return;
    }

    if ((storyType === 'photo' || storyType === 'video') && !selectedImage) {
      toast.error(`Please select a ${storyType} for your story`);
      return;
    }

    // Calculate expiry based on selected duration
    let expiryHours = 24;
    if (duration === '12h') expiryHours = 12;
    else if (duration === '6h') expiryHours = 6;
    else if (duration === 'custom') expiryHours = customHours[0];
    
    // Create the story data
    const storyData = {
      type: storyType,
      content: storyContent,
      background: selectedBackground,
      textColor,
      fontSize: fontSize[0],
      textAlignment,
      media: storyType === 'video' ? videoUrl : selectedImage,
      privacy,
      duration: expiryHours,
      timestamp: new Date().toISOString()
    };

    onCreateStory(storyData);
    resetForm();
  };

  const getBackgroundClass = (bgId: string) => {
    return backgrounds.find(bg => bg.id === bgId)?.class || 'bg-gray-900';
  };

  const getTextColorClass = (colorId: string) => {
    return colors.find(c => c.id === colorId)?.class || 'text-white';
  };

  const getAlignmentClass = (alignId: string) => {
    return alignments.find(a => a.id === alignId)?.class || 'text-center';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onClose();
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
          {/* Preview Panel */}
          <div className="relative bg-black flex items-center justify-center">
            {storyType === 'text' ? (
              <div 
                className={`w-full h-full ${getBackgroundClass(selectedBackground)} flex items-center justify-center p-6`}
              >
                <p 
                  className={`${getTextColorClass(textColor)} ${getAlignmentClass(textAlignment)}`}
                  style={{ fontSize: `${fontSize[0]}px` }}
                >
                  {storyContent || 'Your story text will appear here'}
                </p>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {storyType === 'video' && videoUrl ? (
                  <video 
                    src={videoUrl}
                    className="max-h-full max-w-full object-contain"
                    controls
                    muted
                  />
                ) : selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt="Story preview" 
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Select a {storyType} to preview</p>
                  </div>
                )}
              </div>
            )}

            {/* Privacy badge preview */}
            <div className="absolute top-4 right-4 z-10">
              <Badge className={privacy === 'public' ? 'bg-green-500 text-white' : 
                             privacy === 'friends' ? 'bg-blue-500 text-white' : 
                             'bg-purple-500 text-white'}>
                {privacy === 'close-friends' ? 'Close Friends' : 
                 privacy === 'friends' ? 'Friends' : 'Public'}
              </Badge>
            </div>

            {/* Expiration preview */}
            <div className="absolute top-4 left-4 z-10">
              <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                <Clock className="w-3 h-3 mr-1" />
                {duration === 'custom' ? `${customHours[0]}h` : duration}
              </Badge>
            </div>
          </div>

          {/* Editor Panel */}
          <div className="bg-white p-4 overflow-y-auto dark:bg-gray-800">
            <Tabs defaultValue={storyType} onValueChange={(value: string) => setStoryType(value as 'photo' | 'video' | 'text')} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="photo" className="flex items-center space-x-2">
                  <Camera className="w-4 h-4" />
                  <span>Photo</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Video</span>
                </TabsTrigger>
                <TabsTrigger value="text" className="flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <span>Text</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="photo" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center dark:border-gray-600">
                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto dark:border-gray-700"></div>
                      <p className="text-gray-600 dark:text-gray-300">Uploading photo...</p>
                    </div>
                  ) : selectedImage ? (
                    <div className="space-y-2">
                      <img 
                        src={selectedImage} 
                        alt="Selected" 
                        className="max-h-40 mx-auto object-contain rounded"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRemoveMedia}
                        className="dark:border-gray-600 dark:text-gray-200"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Camera className="w-12 h-12 text-gray-400 mx-auto dark:text-gray-600" />
                      <p className="text-gray-600 dark:text-gray-300">Add a photo to your story</p>
                      <div className="flex justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSelectFile}
                          className="dark:border-gray-600 dark:text-gray-200"
                        >
                          Choose File
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={simulateImageUpload}
                          className="dark:border-gray-600 dark:text-gray-200"
                        >
                          Use Sample
                        </Button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Caption (Optional)</label>
                  <Textarea
                    placeholder="Add a caption to your story..."
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    rows={3}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center dark:border-gray-600">
                  {isUploading ? (
                    <div className="space-y-2">
                      <div className="w-8 h-8 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto dark:border-gray-700"></div>
                      <p className="text-gray-600 dark:text-gray-300">Uploading video...</p>
                    </div>
                  ) : videoUrl ? (
                    <div className="space-y-2">
                      <video 
                        src={videoUrl}
                        className="max-h-40 mx-auto"
                        controls
                        muted
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleRemoveMedia}
                        className="dark:border-gray-600 dark:text-gray-200"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Video className="w-12 h-12 text-gray-400 mx-auto dark:text-gray-600" />
                      <p className="text-gray-600 dark:text-gray-300">Add a video to your story</p>
                      <div className="flex justify-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleSelectVideo}
                          className="dark:border-gray-600 dark:text-gray-200"
                        >
                          Choose Video
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setVideoUrl('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
                            setSelectedImage('https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?w=800&h=600&fit=crop');
                          }}
                          className="dark:border-gray-600 dark:text-gray-200"
                        >
                          Use Sample
                        </Button>
                      </div>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Caption (Optional)</label>
                  <Textarea
                    placeholder="Add a caption to your story..."
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    rows={3}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-gray-200">Your Story Text</label>
                  <Textarea
                    placeholder="What's on your mind?"
                    value={storyContent}
                    onChange={(e) => setStoryContent(e.target.value)}
                    rows={5}
                    className="mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center dark:text-gray-200">
                      <Palette className="w-4 h-4 mr-2" />
                      Background
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {backgrounds.map((bg) => (
                        <div
                          key={bg.id}
                          className={`h-10 rounded-md cursor-pointer ${bg.class} ${
                            selectedBackground === bg.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedBackground(bg.id)}
                          title={bg.name}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center dark:text-gray-200">
                      <Type className="w-4 h-4 mr-2" />
                      Text Color
                    </label>
                    <div className="grid grid-cols-6 gap-2">
                      {colors.map((color) => (
                        <div
                          key={color.id}
                          className={`h-8 rounded-md cursor-pointer border ${
                            color.id === 'white' ? 'border-gray-300 dark:border-gray-500' : 'border-transparent'
                          } ${
                            textColor === color.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          style={{ backgroundColor: color.id }}
                          onClick={() => setTextColor(color.id)}
                          title={color.name}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center dark:text-gray-200">
                      <Sliders className="w-4 h-4 mr-2" />
                      Font Size
                    </label>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={12}
                      max={32}
                      step={1}
                      className="py-4"
                    />
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">{fontSize[0]}px</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">Text Alignment</label>
                    <div className="flex space-x-2">
                      {alignments.map((align) => (
                        <Button
                          key={align.id}
                          variant={textAlignment === align.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTextAlignment(align.id)}
                          className="flex-1 dark:border-gray-600"
                        >
                          {align.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Common settings for all story types */}
            <div className="space-y-4 mt-6 pt-4 border-t dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center dark:text-gray-200">
                  <Globe className="w-4 h-4 mr-2" />
                  Privacy
                </label>
                <Select value={privacy} onValueChange={(value: string) => setPrivacy(value as 'public' | 'friends' | 'close-friends')}>
                  <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <SelectValue placeholder="Who can see your story?" />
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
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span>Friends</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="close-friends">
                      <div className="flex items-center">
                        <Lock className="w-4 h-4 mr-2 text-purple-500" />
                        <span>Close Friends</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center dark:text-gray-200">
                  <Clock className="w-4 h-4 mr-2" />
                  Duration
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  <Button
                    variant={duration === '24h' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration('24h')}
                    className="dark:border-gray-600"
                  >
                    24 hours
                  </Button>
                  <Button
                    variant={duration === '12h' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration('12h')}
                    className="dark:border-gray-600"
                  >
                    12 hours
                  </Button>
                  <Button
                    variant={duration === '6h' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration('6h')}
                    className="dark:border-gray-600"
                  >
                    6 hours
                  </Button>
                  <Button
                    variant={duration === 'custom' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDuration('custom')}
                    className="dark:border-gray-600"
                  >
                    Custom
                  </Button>
                </div>
                
                {duration === 'custom' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Custom Duration (hours)
                    </label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={customHours}
                        onValueChange={setCustomHours}
                        min={1}
                        max={48}
                        step={1}
                        className="flex-1"
                      />
                      <span className="font-medium dark:text-white">{customHours[0]}h</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t dark:border-gray-700">
              <Button 
                variant="outline" 
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                Cancel
              </Button>
              <Button onClick={handleCreateStory}>
                Share to Story
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryCreator;