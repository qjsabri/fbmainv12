@@ .. @@
 import { toast } from 'sonner';
 import ReactionPicker from '../ReactionPicker';
 import { storage } from '@/lib/storage';
 import { STORAGE_KEYS } from '@/lib/constants';
 
-const PostCard: React.FC<PostCardProps> = ({ post }) => {
+const PostCard = React.memo<PostCardProps>(({ post }) => {
   const [showComments, setShowComments] = useState(false);
   const [newComment, setNewComment] = useState('');
   const [isLiked, setIsLiked] = useState(post.user_has_liked || false);
   const [isSaved, setIsSaved] = useState(false);
@@ .. @@
               </AnimatePresence>
             </div>
             
-            {/* Add Comment */}
+            {/* Add Comment - Optimized for mobile */}
             <div className="mt-3 pt-3 border-t border-gray-200 px-3 pb-3 flex space-x-2 dark:border-gray-700">
               <Avatar className="w-8 h-8 flex-shrink-0">
                 <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=400&h=400&fit=crop&crop=face" />
                 <AvatarFallback className="bg-blue-500 text-white text-xs">U</AvatarFallback>
               </Avatar>
               <div className="flex-1 flex space-x-2">
                 <Input
                   placeholder="Write a comment..."
                   value={newComment}
                   onChange={(e) => setNewComment(e.target.value)}
                   onKeyPress={handleKeyPress}
-                  className="rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-responsive-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
+                  className="rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm h-9 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                 />
                 <Button 
                   onClick={handleSubmitComment} 
                   size="sm"
                   disabled={!newComment.trim()}
-                  className="rounded-full px-4 button-responsive"
+                  className="rounded-full px-3 h-9 min-w-[60px]"
                 >
                   Post
                 </Button>
               </div>
             </div>
           </div>
         )}
       </CardContent>
     </Card>
   );
-};
+});
 
-// Use React.memo to prevent unnecessary re-renders
-export default memo(PostCard);
+PostCard.displayName = 'PostCard';
+
+export default PostCard;