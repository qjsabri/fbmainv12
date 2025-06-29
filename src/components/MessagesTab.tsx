import React, { useState, useEffect } from 'react';
import { Search, MoreHorizontal, Edit, Filter, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import OnlineStatus from './OnlineStatus';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import { MOCK_IMAGES } from '@/lib/constants';
import { toast } from 'sonner';

const MessagesTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState([
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        avatar: MOCK_IMAGES.AVATARS[0],
        isOnline: true,
        lastActive: 'Active now'
      },
      lastMessage: {
        content: 'Hey! How are you doing?',
        timestamp: '2h',
        isRead: false
      },
      unreadCount: 2
    },
    {
      id: '2',
      user: {
        name: 'Mike Chen',
        avatar: MOCK_IMAGES.AVATARS[1],
        isOnline: false,
        lastActive: '3h ago'
      },
      lastMessage: {
        content: 'Did you see that new movie?',
        timestamp: '1d',
        isRead: true
      },
      unreadCount: 0
    },
    {
      id: '3',
      user: {
        name: 'Emma Wilson',
        avatar: MOCK_IMAGES.AVATARS[2],
        isOnline: true,
        lastActive: 'Active now'
      },
      lastMessage: {
        content: 'Thanks for your help!',
        timestamp: '4d',
        isRead: true
      },
      unreadCount: 0
    }
  ]);

  const [messages, setMessages] = useState<Record<string, Array<{
    id: string;
    content: string;
    timestamp: Date;
    senderId: string;
    status: 'sending' | 'sent' | 'delivered' | 'read';
  }>>>({
    '1': [
      {
        id: '1-1',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 3600000 * 3),
        senderId: '1',
        status: 'read'
      },
      {
        id: '1-2',
        content: 'I\'m good, thanks for asking! How about you?',
        timestamp: new Date(Date.now() - 3600000 * 2),
        senderId: 'currentUser',
        status: 'read'
      },
      {
        id: '1-3',
        content: 'I\'m doing great! Just finishing up a project.',
        timestamp: new Date(Date.now() - 3600000 * 1),
        senderId: '1',
        status: 'read'
      },
      {
        id: '1-4',
        content: 'That sounds interesting! What kind of project is it?',
        timestamp: new Date(Date.now() - 1800000),
        senderId: 'currentUser',
        status: 'delivered'
      }
    ],
    '2': [
      {
        id: '2-1',
        content: 'Did you see that new movie?',
        timestamp: new Date(Date.now() - 86400000),
        senderId: '2',
        status: 'read'
      }
    ],
    '3': [
      {
        id: '3-1',
        content: 'Thanks for your help!',
        timestamp: new Date(Date.now() - 86400000 * 4),
        senderId: '3',
        status: 'read'
      }
    ]
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showConversation, setShowConversation] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && !selectedConversationId) {
        // On desktop, show the first conversation by default
        setSelectedConversationId(conversations[0].id);
        setShowConversation(true);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Initialize with first conversation selected on desktop
    if (!isMobile && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
      setShowConversation(true);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, selectedConversationId, conversations]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    
    // Mark conversation as read
    setConversations(conversations.map(conversation => 
      conversation.id === id 
        ? { ...conversation, unreadCount: 0 } 
        : conversation
    ));
    
    setShowConversation(true);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedConversationId) return;
    
    const newMessage = {
      id: `${selectedConversationId}-${Date.now()}`,
      content,
      timestamp: new Date(),
      senderId: 'currentUser',
      status: 'sending' as const
    };
    
    // Add message to state
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...prev[selectedConversationId], newMessage]
    }));
    
    // Update conversation's last message
    setConversations(prev => prev.map(conversation => 
      conversation.id === selectedConversationId 
        ? { 
            ...conversation, 
            lastMessage: {
              content,
              timestamp: 'Just now',
              isRead: true
            }
          } 
        : conversation
    ));
    
    // Simulate message status updates
    setTimeout(() => {
      updateMessageStatus(newMessage.id, 'sent');
      
      setTimeout(() => {
        updateMessageStatus(newMessage.id, 'delivered');
        
        // Simulate read
        setTimeout(() => {
          updateMessageStatus(newMessage.id, 'read');
          
          // Simulate reply after a delay for some conversations
          if (['1', '3'].includes(selectedConversationId) && Math.random() > 0.5) {
            simulateReply(selectedConversationId);
          }
        }, 2000);
      }, 1000);
    }, 500);
    
    toast.success('Message sent');
  };

  const updateMessageStatus = (messageId: string, status: 'sending' | 'sent' | 'delivered' | 'read') => {
    setMessages(prev => {
      const updatedMessages = { ...prev };
      
      // Find the conversation that contains this message
      Object.keys(updatedMessages).forEach(convId => {
        const messageIndex = updatedMessages[convId].findIndex(msg => msg.id === messageId);
        if (messageIndex !== -1) {
          updatedMessages[convId][messageIndex] = {
            ...updatedMessages[convId][messageIndex],
            status
          };
        }
      });
      
      return updatedMessages;
    });
  };

  const simulateReply = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const replies = [
      "Hey! Good to hear from you!",
      "That sounds interesting!",
      "I'll check it out and get back to you.",
      "Thanks for letting me know!",
      "Let's catch up soon!",
      "I was just thinking about that!",
      "Great, I'll see you then!",
      "Sure thing!",
      "I'm available tomorrow if that works for you.",
      "Can you tell me more about that?"
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    setTimeout(() => {
      // Add the reply to messages
      const replyMessage = {
        id: `${conversationId}-reply-${Date.now()}`,
        content: randomReply,
        timestamp: new Date(),
        senderId: conversationId,
        status: 'read' as const
      };
      
      setMessages(prev => ({
        ...prev,
        [conversationId]: [...prev[conversationId], replyMessage]
      }));
      
      // Update conversation
      setConversations(prev => prev.map(conv => 
        conv.id === conversationId 
          ? {
              ...conv,
              lastMessage: {
                content: randomReply,
                timestamp: 'Just now',
                isRead: false
              },
              unreadCount: selectedConversationId === conversationId ? 0 : (conv.unreadCount || 0) + 1
            }
          : conv
      ));
      
      // If user is looking at another conversation, show toast
      if (selectedConversationId !== conversationId) {
        toast.info(`New message from ${conversation.user.name}`);
      }
    }, 3000);
  };

  const handleBackToList = () => {
    setShowConversation(false);
  };

  const selectedConversation = conversations.find(conversation => conversation.id === selectedConversationId);
  const currentMessages = selectedConversationId ? messages[selectedConversationId] : [];

  return (
    <div className="container-responsive mx-auto py-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm dark:bg-gray-800 overflow-hidden">
          <div className="flex flex-col md:flex-row h-[calc(100vh-8rem)]">
            {/* Conversations List - hidden on mobile when viewing a conversation */}
            {(!isMobile || !showConversation) && (
              <div className="w-full md:w-80 border-r dark:border-gray-700 flex flex-col">
                <div className="p-3 border-b dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold dark:text-white">Messages</h2>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Filter className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search messages"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-9"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations
                    .filter(conversation => 
                      conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3 dark:hover:bg-gray-700 ${
                        selectedConversationId === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      } ${conversation.unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      onClick={() => handleSelectConversation(conversation.id)}
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.user.avatar} />
                          <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <OnlineStatus isOnline={conversation.user.isOnline} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm text-gray-900 truncate dark:text-white">{conversation.user.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.lastMessage?.timestamp}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${
                            conversation.unreadCount ? 'text-gray-900 font-medium dark:text-white' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {conversation.lastMessage?.content}
                          </p>
                          {conversation.unreadCount ? (
                            <Badge className="ml-2 bg-blue-600">{conversation.unreadCount}</Badge>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Conversation View */}
            {(showConversation && selectedConversation) ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Conversation Header */}
                <div className="p-3 border-b flex items-center justify-between dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    {isMobile && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBackToList}
                        className="md:hidden h-9 w-9 p-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="w-5 h-5"
                        >
                          <path d="m15 18-6-6 6-6" />
                        </svg>
                      </Button>
                    )}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedConversation.user.avatar} />
                      <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm dark:text-white">{selectedConversation.user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedConversation.user.isOnline ? 'Active now' : selectedConversation.user.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => toast.info('Starting audio call')}>
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => toast.info('Starting video call')}>
                      <Video className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50 dark:bg-gray-900">
                  {currentMessages.map((message) => (
                    <div key={message.id}>
                      <MessageBubble
                        message={{
                          ...message,
                          conversationId: selectedConversationId || '',
                          type: 'text',
                          reactions: [],
                        }}
                        sender={{
                          id: message.senderId,
                          name: message.senderId === 'currentUser' ? 
                            'You' : 
                            selectedConversation.user.name,
                          avatar: message.senderId === 'currentUser' ? 
                            MOCK_IMAGES.AVATARS[7] : 
                            selectedConversation.user.avatar,
                          isOnline: message.senderId === 'currentUser' ? 
                            true : 
                            selectedConversation.user.isOnline,
                          lastSeen: message.senderId === 'currentUser' ? 
                            undefined : 
                            selectedConversation.user.lastActive
                        }}
                        isOwn={message.senderId === 'currentUser'}
                        showAvatar={true}
                        showTimestamp={true}
                        onReply={(message) => toast.info('Reply feature coming soon')}
                        onEdit={(message) => toast.info('Edit feature coming soon')}
                        onDelete={(message) => toast.info('Delete feature coming soon')}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Message Input */}
                <MessageComposer
                  conversationId={selectedConversationId}
                  onSendMessage={handleSendMessage}
                  placeholder="Type a message..."
                />
              </div>
            ) : (
              // Empty state for desktop when no conversation is selected
              !isMobile && (
                <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-center p-5">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-blue-900/30">
                      <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-white">Your Messages</h3>
                    <p className="text-gray-500 mb-4 dark:text-gray-400">Select a conversation to start chatting</p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// MessageCircle icon component
const MessageCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export default MessagesTab;