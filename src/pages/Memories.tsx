import React, { useState, useMemo } from 'react';
import { Calendar, Heart, MessageCircle, Share, Camera, Clock, MapPin, ChevronLeft, ChevronRight, Users, Bookmark, AlertCircle, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MOCK_IMAGES } from '@/lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subYears, subMonths, subDays, parseISO } from 'date-fns';
import MemoryOnThisDay from '@/components/MemoryOnThisDay';
import MemoryTimeline from '@/components/MemoryTimeline';
import MemoryYearInReview from '@/components/MemoryYearInReview';
import MemoriesCollection from '@/components/MemoriesCollection';

interface Memory {
  id: string;
  type: 'photo' | 'post' | 'event' | 'friendship';
  title: string;
  date: Date;
  yearsAgo: number;
  images: string[];
  content?: string;
  location?: string;
  peopleTagged?: {
    id: string;
    name: string;
    avatar: string;
  }[];
  interactions: {
    likes: number;
    comments: number;
    shares: number;
  };
  isLiked?: boolean;
  comments?: {
    id: string;
    author: {
      name: string;
      avatar: string;
    };
    content: string;
    timestamp: string;
  }[];
}

const Memories = () => {
  // Implement cache for selected memory to improve performance
  const [, setSelectedMemory] = useState<Memory | null>(null);
  const [, setIsMemoryDetailOpen] = useState(false);
  const [, setNewComment] = useState('');
  const [, setCurrentSlide] = useState(0);
  const [activeView, setActiveView] = useState<'onThisDay' | 'timeline' | 'yearInReview' | 'collections'>('onThisDay');
  // Use memoization for constant values
  const today = useMemo(() => new Date(), []);

  const handleShare = (memory: Memory) => {
    toast.success(`Shared memory: ${memory.title}`);
  };

  const handleLike = (_memoryId: string) => {
    toast.success('Memory reaction updated!');
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedMemory) return;
    
    setNewComment('');
    toast.success('Comment added!');
  };

  const handlePrevSlide = () => {
    if (!selectedMemory) return;
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : selectedMemory.images.length - 1));
  };

  const handleNextSlide = () => {
    if (!selectedMemory) return;
    setCurrentSlide(prev => (prev < selectedMemory.images.length - 1 ? prev + 1 : 0));
  };

  const getMemoryIcon = (type: string) => {
    switch (type) {
      case 'photo': return <Camera className="w-5 h-5 text-blue-500" />;
      case 'event': return <Calendar className="w-5 h-5 text-green-500" />;
      case 'friendship': return <Users className="w-5 h-5 text-purple-500" />;
      default: return <MessageCircle className="w-5 h-5 text-purple-500" />;
    }
  };

  const renderMemoryContent = () => {
    switch (activeView) {
      case 'onThisDay':
        return <MemoryOnThisDay />;
      case 'timeline':
        return <MemoryTimeline />;
      case 'yearInReview':
        return <MemoryYearInReview />;
      case 'collections':
        return <MemoriesCollection />;
      default:
        return <MemoryOnThisDay />;
    }
  };

  return (
    <div className="w-full">
      <div className="container-responsive mx-auto py-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">Memories</h1>
            <p className="text-gray-600 dark:text-gray-300">Look back on your favorite moments</p>
          </div>

          {/* Today's Date */}
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">{format(today, 'MMMM d, yyyy')}</h2>
              <p className="text-blue-100">See what happened on this day in previous years</p>
            </CardContent>
          </Card>

          {/* View Selector */}
          <div className="mb-6">
            <Tabs value={activeView} onValueChange={(value: string) => setActiveView(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="onThisDay" className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>On This Day</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="yearInReview" className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Year in Review</span>
                </TabsTrigger>
                <TabsTrigger value="collections" className="flex items-center space-x-2">
                  <Bookmark className="w-4 h-4" />
                  <span>Collections</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Memory Content */}
          {renderMemoryContent()}
        </div>
      </div>

      {/* Memory Detail Dialog */}
      <Dialog open={isMemoryDetailOpen} onOpenChange={setIsMemoryDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="p-4 border-b dark:border-gray-700">
            <DialogTitle className="flex items-center space-x-2">
              {selectedMemory && getMemoryIcon(selectedMemory.type)}
              <span>{selectedMemory?.title || 'Memory'}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedMemory && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
              {/* Image Viewer */}
              <div className="relative bg-black flex items-center justify-center">
                {selectedMemory.images.length > 0 ? (
                  <>
                    <img 
                      src={selectedMemory.images[currentSlide]} 
                      alt={`Memory ${currentSlide + 1}`}
                      className="max-h-full max-w-full object-contain"
                    />
                    
                    {/* Navigation arrows */}
                    {selectedMemory.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handlePrevSlide}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 rounded-full p-0"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleNextSlide}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 h-10 w-10 rounded-full p-0"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                        
                        {/* Slide indicators */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                          {selectedMemory.images.map((_, index) => (
                            <div 
                              key={index} 
                              className={`w-2 h-2 rounded-full ${
                                index === currentSlide ? 'bg-white' : 'bg-white/50'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-white p-6">
                    <AlertCircle className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">No images available for this memory</p>
                  </div>
                )}
              </div>
              
              {/* Memory Details & Comments */}
              <div className="flex flex-col h-full bg-white dark:bg-gray-800">
                {/* Memory Info */}
                <div className="p-4 border-b dark:border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={MOCK_IMAGES.AVATARS[7]} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold dark:text-white">Your Memory</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{format(selectedMemory.date, 'MMMM d, yyyy')} • {selectedMemory.yearsAgo} {selectedMemory.yearsAgo === 1 ? 'year' : 'years'} ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 mb-3 dark:text-white">{selectedMemory.content}</p>
                  
                  {/* Location */}
                  {selectedMemory.location && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3 dark:text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedMemory.location}</span>
                    </div>
                  )}
                  
                  {/* Tagged People */}
                  {selectedMemory.peopleTagged && selectedMemory.peopleTagged.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">With:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMemory.peopleTagged.map((person) => (
                          <div key={person.id} className="flex items-center space-x-1 bg-gray-100 rounded-full px-2 py-1 dark:bg-gray-700">
                            <Avatar className="w-5 h-5">
                              <AvatarImage src={person.avatar} />
                              <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{person.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Interactions */}
                  <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <span>{selectedMemory.interactions.likes} likes</span>
                      <span>{selectedMemory.interactions.comments} comments</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(selectedMemory.id)}
                        className={`text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 ${
                          selectedMemory.isLiked ? 'text-red-600 dark:text-red-400' : ''
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${selectedMemory.isLiked ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(selectedMemory)}
                        className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400"
                      >
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Comments */}
                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="font-semibold mb-4 dark:text-white">Comments</h3>
                  
                  <div className="space-y-4">
                    <AnimatePresence>
                      {selectedMemory.comments && selectedMemory.comments.length > 0 ? (
                        selectedMemory.comments.map((comment) => (
                          <motion.div 
                            key={comment.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex space-x-3"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={comment.author.avatar} />
                              <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-100 rounded-lg px-3 py-2 dark:bg-gray-700">
                                <p className="font-medium text-sm dark:text-white">{comment.author.name}</p>
                                <p className="text-sm dark:text-gray-200">{comment.content}</p>
                              </div>
                              <div className="flex items-center mt-1 space-x-4">
                                <span className="text-xs text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                                <button className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                  Like
                                </button>
                                <button className="text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                  Reply
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
                
                {/* Add Comment */}
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="flex space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={MOCK_IMAGES.AVATARS[7]} />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <Button 
                        size="sm" 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        Post
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Memories;