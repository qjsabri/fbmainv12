import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Plus, MoreHorizontal, Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface GroupFile {
  id: string;
  name: string;
  type: 'image' | 'document' | 'video';
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  avatar?: string;
}

interface GroupFilesViewProps {
  files: GroupFile[];
  isJoined: boolean;
  onUploadFile: () => void;
}

const GroupFilesView: React.FC<GroupFilesViewProps> = ({
  files,
  isJoined,
  onUploadFile
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileType, setFileType] = useState<string>('all');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = fileType === 'all' || file.type === fileType;
    return matchesSearch && matchesType;
  });

  const handleDownload = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (file) {
      toast.success(`Downloading ${file.name}`);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'document':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400">
            <path d="m22 8-6 4 6 4V8Z" />
            <rect x="2" y="6" width="14" height="12" rx="2" ry="2" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold dark:text-white">Files & Media</h2>
        {isJoined && (
          <Button onClick={onUploadFile}>
            <Plus className="w-4 h-4 mr-2" />
            Upload
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <select
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="all">All Files</option>
          <option value="image">Images</option>
          <option value="document">Documents</option>
          <option value="video">Videos</option>
        </select>
        <Button variant="outline" size="icon" className="dark:border-gray-600 dark:text-gray-200">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {filteredFiles.length > 0 ? (
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {file.type === 'image' ? (
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 dark:bg-blue-900/30">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate dark:text-white">{file.name}</h4>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>{file.size}</span>
                      <span className="mx-2">•</span>
                      <span>Uploaded {file.uploadedAt}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Avatar className="w-5 h-5 mr-1">
                        <AvatarImage src={file.avatar} />
                        <AvatarFallback>{file.uploadedBy.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{file.uploadedBy}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="dark:text-gray-300"
                      onClick={() => handleDownload(file.id)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="dark:text-gray-300">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400 dark:text-gray-600">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2 dark:text-white">No files found</h3>
            <p className="text-gray-500 mb-4 dark:text-gray-400">
              {searchQuery 
                ? `No files matching "${searchQuery}"`
                : fileType !== 'all'
                  ? `No ${fileType} files found`
                  : "No files have been shared in this group yet."}
            </p>
            {isJoined && (
              <Button onClick={onUploadFile}>
                <Plus className="w-4 h-4 mr-2" />
                Upload File
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GroupFilesView;