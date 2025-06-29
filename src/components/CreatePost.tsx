@@ .. @@
 
   return (
     <>
-      <Card className="card-responsive bg-white shadow-sm border-0 shadow-gray-100 mb-4 dark:bg-gray-800 dark:shadow-gray-900">
+      <Card className="card-responsive bg-white shadow-sm border-0 shadow-gray-100 mb-4 dark:bg-gray-800 dark:shadow-gray-900 overflow-hidden">
         <CardContent className="spacing-responsive">
           <div className="flex space-x-3">
             <Avatar className="avatar-responsive">
               <AvatarImage src={user.user_metadata?.avatar_url} />
               <AvatarFallback>{user.user_metadata?.full_name?.charAt(0) || 'U'}</AvatarFallback>
             </Avatar>
-            <div className="flex-1">
+            <div className="flex-1 min-w-0">
               {!isExpanded ? (
                 <button
                   onClick={handleExpand}
-                  className="w-full text-left p-2 sm:p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors text-responsive-sm touch-target dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
+                  className="w-full text-left p-2 sm:p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors text-xs sm:text-sm touch-target dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                 >
                   What's on your mind, {user.user_metadata?.full_name?.split(' ')[0] || 'there'}?
                 </button>
@@ .. @@
                 <div className="space-y-3">
                   <Textarea
                     placeholder={`What's on your mind, ${user.user_metadata?.full_name?.split(' ')[0] || 'there'}?`}
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
-                    className="border-0 resize-none focus:ring-0 text-responsive-base p-0 min-h-[80px] sm:min-h-[100px] dark:bg-gray-800 dark:text-gray-100"
+                    className="border-0 resize-none focus:ring-0 text-sm sm:text-base p-0 min-h-[60px] sm:min-h-[100px] dark:bg-gray-800 dark:text-gray-100"
                     autoFocus
                   />
 
                   {/* Status indicators */}
@@ .. @@
                   </div>
 
                   {/* Image Preview */}
-                  {selectedImages.length > 0 && (
-                    <div className="grid grid-cols-2 gap-2">
+                  {selectedImages.length > 0 && (
+                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       {selectedImages.map((image, index) => (
                         <div key={index} className="relative">
                           <img
@@ .. @@
                   </div>
 
                   {/* Enhanced Quick Actions */}
-                  <div className="flex flex-wrap gap-2 py-2 border-t border-gray-100 dark:border-gray-700">
+                  <div className="flex flex-wrap gap-1 sm:gap-2 py-2 border-t border-gray-100 dark:border-gray-700">
                     <Button 
                       variant="ghost" 
                       size="sm" 
-                      className="text-green-600 h-auto py-2 px-3 dark:text-green-400"
+                      className="text-green-600 h-auto py-1.5 px-2 sm:py-2 sm:px-3 text-xs dark:text-green-400"
                       onClick={() => handleFeatureClick('Photo')}
                       disabled={isUploading}
                     >
                       <Image className="w-4 h-4 mr-1" />
                       <span className="text-xs">Photo</span>
                     </Button>
                     
@@ .. @@
                     <Button 
                       variant="ghost" 
                       size="sm" 
-                      className="text-blue-600 h-auto py-2 px-3 dark:text-blue-400"
+                      className="text-blue-600 h-auto py-1.5 px-2 sm:py-2 sm:px-3 text-xs dark:text-blue-400"
                       onClick={() => handleFeatureClick('Tag People')}
                     >
                       <Users className="w-4 h-4 mr-1" />
@@ .. @@
                   <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                     <Button 
                       variant="ghost" 
                       size="sm" 
-                      className="text-gray-600 dark:text-gray-300"
+                      className="text-gray-600 text-xs dark:text-gray-300"
                       onClick={() => handleFeatureClick('Voice Note')}
                     >
                       <Mic className="w-4 h-4 mr-1" />
@@ .. @@
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
 
-          {/* Quick Actions for collapsed state */}
-          {!isExpanded && (
-            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
-              <div className="flex space-x-1 sm:space-x-2">
+          {/* Quick Actions for collapsed state - Optimized for mobile */}
+          {!isExpanded && (
+            <div className="flex items-center justify-around sm:justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
+              <Button 
+                variant="ghost" 
+                size="sm" 
+                className="text-red-600 py-1 px-2 sm:py-2 sm:px-3 text-xs dark:text-red-400"
+                onClick={() => handleFeatureClick('Live Video')}
+              >
+                <Video className="w-4 h-4 mr-1" />
+                <span className="text-xs">Live</span>
+              </Button>
                 <Button 
                   variant="ghost" 
                   size="sm" 
-                  className="text-red-600 flex-1 sm:flex-none dark:text-red-400"
-                  onClick={() => handleFeatureClick('Live Video')}
-                >
-                  <Video className="w-4 h-4 mr-1" />
-                  <span className="text-xs">Live video</span>
-                </Button>
-                <Button 
-                  variant="ghost" 
-                  size="sm" 
-                  className="text-green-600 flex-1 sm:flex-none dark:text-green-400"
+                  className="text-green-600 py-1 px-2 sm:py-2 sm:px-3 text-xs dark:text-green-400"
                   onClick={() => handleFeatureClick('Photo')}
                 >
                   <Image className="w-4 h-4 mr-1" />
                   <span className="text-xs">Photo</span>
                 </Button>
                 <Button 
                   variant="ghost" 
                   size="sm" 
-                  className="text-yellow-600 flex-1 sm:flex-none dark:text-yellow-400"
+                  className="text-yellow-600 py-1 px-2 sm:py-2 sm:px-3 text-xs dark:text-yellow-400"
                   onClick={() => handleFeatureClick('Feeling/Activity')}
                 >
                   <Smile className="w-4 h-4 mr-1" />
                   <span className="text-xs">Feeling</span>
                 </Button>
-              </div>
             </div>
           )}
         </CardContent>