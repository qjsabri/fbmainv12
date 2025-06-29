import React from 'react';

interface MessageBubbleProps {
  message: {
    id: string;
    conversationId: string;
    type: string;
    content: string;
    timestamp: Date;
    senderId: string;
    status: string;
    reactions: any[];
  };
  sender: {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
    lastSeen?: string;
  };
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onReply?: (message: any) => void;
  onEdit?: (message: any) => void;
  onDelete?: (message: any) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  sender,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  onReply,
  onEdit,
  onDelete
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div 
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}
      data-message-id={message.id}
    >
      {!isOwn && showAvatar && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            {sender.avatar && (
              <img 
                src={sender.avatar} 
                alt={sender.name} 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
        </div>
      )}
      
      <div className="max-w-[70%]">
        <div 
          className={`px-3 py-2 rounded-lg ${
            isOwn ? 
              'bg-blue-600 text-white rounded-br-none' : 
              'bg-gray-200 text-gray-900 rounded-bl-none dark:bg-gray-700 dark:text-white'
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        
        {showTimestamp && (
          <div className="text-xs text-gray-500 mt-1 dark:text-gray-400">
            {formatTime(message.timestamp)}
            {isOwn && (
              <span className="ml-2">
                {message.status === 'sent' && '✓'}
                {message.status === 'delivered' && '✓✓'}
                {message.status === 'read' && <span className="text-blue-500">✓✓</span>}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;