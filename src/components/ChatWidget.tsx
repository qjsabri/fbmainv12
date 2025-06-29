import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Smile, Paperclip, Mic, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { MOCK_IMAGES, getSafeImage } from '@/lib/constants';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import EmojiPicker from './EmojiPicker';
import AttachmentOptions from './AttachmentOptions';
import { memo } from 'react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastActive?: string;
  lastMessage?: string;
  unreadCount?: number;
}

interface Message {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'contact';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: {
    type: 'image' | 'file' | 'audio' | 'sticker';
    url: string;
    name?: string;
  }[];
}

// Memoize to prevent unnecessary re-renders
const ChatWidget = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: MOCK_IMAGES.AVATARS[0],
      isOnline: true,
      lastMessage: 'Hey! How are you doing?',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: MOCK_IMAGES.AVATARS[1],
      isOnline: false,
      lastActive: '1h ago',
      lastMessage: 'Did you see the latest React update?'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      avatar: getSafeImage('AVATARS', 2),
      isOnline: true,
      lastMessage: 'Thanks for your help!'
    }
  ]);
  
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1-1',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        sender: 'contact',
        status: 'read'
      },
      {
        id: '1-2',
        content: 'I\'m doing great! Just working on some projects.',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
        sender: 'user',
        status: 'read'
      },
      {
        id: '1-3',
        content: 'That sounds interesting! What kind of projects?',
        timestamp: new Date(Date.now() - 20 * 60 * 1000),
        sender: 'contact',
        status: 'read'
      },
      {
        id: '1-4',
        content: 'Mostly React development. Building a social media app clone!',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        sender: 'user',
        status: 'delivered'
      },
      {
        id: '1-5',
        content: 'That\'s awesome! I\'d love to see it when it\'s ready.',
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        sender: 'contact',
        status: 'sent'
      }
    ],
    '2': [
      {
        id: '2-1',
        content: 'Did you see the latest React update?',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        sender: 'contact',
        status: 'read'
      },
      {
        id: '2-2',
        content: 'Yes! The new hooks are amazing!',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        sender: 'user',
        status: 'read'
      }
    ],
    '3': [
      {
        id: '3-1',
        content: 'Thanks for your help with that React problem!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        sender: 'contact',
        status: 'read'
      },
      {
        id: '3-2',
        content: 'No problem! Did you try using useEffect?',
        timestamp: new Date(Date.now() - 47 * 60 * 60 * 1000),
        sender: 'user',
        status: 'read'
      },
      {
        id: '3-3',
        content: 'That worked perfectly! Thanks for your help!',
        timestamp: new Date(Date.now() - 46 * 60 * 60 * 1000),
        sender: 'contact',
        status: 'read'
      }
    ]
  });

  const [newMessage, setNewMessage] = useState('');
  const [newContactName, setNewContactName] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current && activeContact) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeContact]);

  // Simulate typing indicator
  useEffect(() => {
    if (activeContact && messages[activeContact.id]) {
      const lastMessage = messages[activeContact.id][messages[activeContact.id].length - 1];
      
      if (lastMessage && lastMessage.sender === 'user') {
        const typingTimeout = setTimeout(() => {
          setIsTyping(true);
          
          // Simulate response after typing
          const responseTimeout = setTimeout(() => {
            setIsTyping(false);
            
            const responses = [
              "That sounds great!",
              "I'll check my schedule and let you know.",
              "Sorry, I can't make it this weekend.",
              "Yes, I'd love to!",
              "Can we do it next week instead?",
              "What time were you thinking?",
              "I've heard good things about that place!",
              "Do you want to invite anyone else?",
              "I'm looking forward to catching up!"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            
            const newMsg: Message = {
              id: Date.now().toString(),
              content: randomResponse,
              timestamp: new Date(),
              sender: 'contact',
              status: 'read'
            };
            
            setMessages(prev => ({
              ...prev,
              [activeContact.id]: [...prev[activeContact.id], newMsg]
            }));
            
            // Update contact's last message
            setContacts(prev => prev.map(contact => 
              contact.id === activeContact.id 
                ? { ...contact, lastMessage: randomResponse } 
                : contact
            ));
          }, 3000);
          
          return () => clearTimeout(responseTimeout);
        }, 1500);
        
        return () => clearTimeout(typingTimeout);
      }
    }
  }, [messages, activeContact]);

  // Listen for custom events to open messenger with a specific contact
  useEffect(() => {
    const handleOpenMessenger = (event: CustomEvent) => {
      const { contact } = event.detail;
      if (contact) {
        // Find the contact in our list or add it if it doesn't exist
        const existingContact = contacts.find(c => c.id === contact.id);
        if (existingContact) {
          setActiveContact(existingContact);
        } else {
          const newContact: Contact = {
            id: contact.id,
            name: contact.name,
            avatar: contact.avatar,
            isOnline: contact.isOnline,
            lastActive: contact.lastActive
          };
          setContacts(prev => [...prev, newContact]);
          setActiveContact(newContact);
          // Initialize empty messages array for this contact
          setMessages(prev => ({
            ...prev,
            [contact.id]: []
          }));
        }
        setIsOpen(true);
      }
    };

    document.addEventListener('openMessenger', handleOpenMessenger as EventListener);
    return () => {
      document.removeEventListener('openMessenger', handleOpenMessenger as EventListener);
    };
  }, [contacts]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (activeContact) {
      setActiveContact(null);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setActiveContact(contact);
    
    // Mark messages as read
    if (contact.unreadCount) {
      setContacts(prev => 
        prev.map(conv => 
          conv.id === contact.id 
            ? { ...conv, unreadCount: 0, lastMessage: conv.lastMessage ? conv.lastMessage : undefined }
            : conv
        )
      );
    }
  };

  const handleSendMessage = (_e: React.FormEvent<HTMLFormElement>) => {
    if (!newMessage.trim() && !showAttachmentOptions) {
      // Send thumbs up if message is empty and not showing attachment options
      const thumbsUpMessage: Message = {
        id: Date.now().toString(),
        content: '',
        timestamp: new Date(),
        sender: 'user',
        status: 'sending',
        attachments: [
          {
            type: 'sticker',
            url: '👍',
            name: 'thumbs-up'
          }
        ]
      };
      
      handleSendMessageObject(thumbsUpMessage);
      return;
    }
    
    if (!newMessage.trim() || !activeContact) return;
    
    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date(),
      sender: 'user',
      status: 'sending'
    };
    
    handleSendMessageObject(message);
  };

  const handleSendMessageObject = (message: Message) => {
    if (!activeContact) return;
    
    // Add message to state
    setMessages(prev => ({
      ...prev,
      [activeContact.id]: [...(prev[activeContact.id] || []), message]
    }));
    
    // Update contact's last message
    setContacts(prev => prev.map(contact => 
      contact.id === activeContact.id 
        ? { 
            ...contact, 
            lastMessage: message.content || (message.attachments?.[0].type === 'sticker' ? 'Sent a sticker' : 'Sent an attachment')
          } 
        : contact
    ));
    
    setNewMessage('');
    setShowAttachmentOptions(false);
    setShowEmojiPicker(false);
    
    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => {
        const contactMessages = [...prev[activeContact.id]];
        const messageIndex = contactMessages.findIndex(msg => msg.id === message.id);
        
        if (messageIndex !== -1) {
          contactMessages[messageIndex] = { ...contactMessages[messageIndex], status: 'sent' };
        }
        
        return {
          ...prev,
          [activeContact.id]: contactMessages
        };
      });
      
      // Simulate delivery
      setTimeout(() => {
        setMessages(prev => {
          const contactMessages = [...prev[activeContact.id]];
          const messageIndex = contactMessages.findIndex(msg => msg.id === message.id);
          
          if (messageIndex !== -1) {
            contactMessages[messageIndex] = { ...contactMessages[messageIndex], status: 'delivered' };
          }
          
          return {
            ...prev,
            [activeContact.id]: contactMessages
          };
        });
        
        // Simulate read
        setTimeout(() => {
          setMessages(prev => {
            const contactMessages = [...prev[activeContact.id]];
            const messageIndex = contactMessages.findIndex(msg => msg.id === message.id);
            
            if (messageIndex !== -1) {
              contactMessages[messageIndex] = { ...contactMessages[messageIndex], status: 'read' };
            }
            
            return {
              ...prev,
              [activeContact.id]: contactMessages
            };
          });
        }, 1000);
      }, 1000);
    }, 500);
  };

  const handleSendImage = () => {
    if (!activeContact) return;
    
    // Trigger file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activeContact) return;

    // Simulate image upload
    toast.info('Uploading image...');
    
    setTimeout(() => {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          
          const imageMessage: Message = {
            id: Date.now().toString(),
            content: '',
            timestamp: new Date(),
            sender: 'user',
            status: 'sending',
            attachments: [
              {
                type: 'image',
                url: imageUrl,
                name: file.name
              }
            ]
          };
          
          handleSendMessageObject(imageMessage);
          toast.success('Image sent');
        }
      };
      
      reader.readAsDataURL(file);
    }, 1500);
    
    // Reset input
    e.target.value = '';
  };

  const handleSendFile = () => {
    toast.info('File upload coming soon');
  };



  const handleVoiceMessage = () => {
    toast.info('Voice message recording started');
    
    // Simulate recording
    setTimeout(() => {
      toast.success('Voice message sent');
      
      if (!activeContact) return;
      
      const audioMessage: Message = {
        id: Date.now().toString(),
        content: '',
        timestamp: new Date(),
        sender: 'user',
        status: 'sending',
        attachments: [
          {
            type: 'audio',
            url: 'audio-message.mp3',
            name: 'Voice message'
          }
        ]
      };
      
      handleSendMessageObject(audioMessage);
    }, 2000);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleCreateNewMessage = () => {
    setIsNewMessageOpen(true);
  };

  const handleSendNewMessage = () => {
    if (!newContactName.trim()) {
      toast.error('Please enter a contact name');
      return;
    }
    
    // Create a new contact
    const newContact: Contact = {
      id: `new-${Date.now()}`,
      name: newContactName,
      avatar: MOCK_IMAGES.AVATARS[Math.floor(Math.random() * MOCK_IMAGES.AVATARS.length)],
      isOnline: Math.random() > 0.5,
      lastActive: Math.random() > 0.5 ? 'Active now' : '1h ago'
    };
    
    // Add to contacts
    setContacts(prev => [newContact, ...prev]);
    
    // Initialize empty messages
    setMessages(prev => ({
      ...prev,
      [newContact.id]: []
    }));
    
    // Select the new contact
    setActiveContact(newContact);
    
    // Close new message dialog
    setIsNewMessageOpen(false);
    setNewContactName('');
    
    toast.success(`New conversation with ${newContactName} started`);
  };

  const totalUnreadCount = contacts.reduce((sum, contact) => sum + (contact.unreadCount || 0), 0);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sending':
        return <div className="w-3 h-3 rounded-full border-2 border-gray-300 border-t-transparent animate-spin dark:border-gray-600"></div>;
      case 'sent':
        return <div className="w-3 h-3 bg-gray-300 rounded-full dark:bg-gray-600"></div>;
      case 'delivered':
        return <div className="w-3 h-3 bg-gray-500 rounded-full dark:bg-gray-400"></div>;
      case 'read':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      default:
        return null;
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Messenger Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button 
          onClick={toggleChat}
          className="h-12 w-12 rounded-full shadow-lg relative"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <>
              <MessageCircle className="h-6 w-6" />
              {totalUnreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white">
                  {totalUnreadCount}
                </Badge>
              )}
            </>
          )}
        </Button>
      </div>

      {/* Messenger Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-xl border z-40 dark:bg-gray-800 dark:border-gray-700"
          >
            {!activeContact ? (
              <>
                <div className="p-3 border-b dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold dark:text-white">Chats</h3>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 dark:text-gray-300"
                        onClick={handleCreateNewMessage}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search messages"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto h-[calc(100%-5rem)]">
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition-colors dark:hover:bg-gray-700 ${
                          activeContact?.id === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        } ${conversation.unreadCount ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        onClick={() => handleSelectContact(conversation)}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={conversation.avatar} />
                            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                          )}
                        </div>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate dark:text-white">{conversation.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{conversation.lastMessage?.timestamp}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate ${
                              conversation.unreadCount ? 'text-gray-900 font-medium dark:text-white' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {conversation.isTyping ? (
                                <span className="text-blue-600 dark:text-blue-400">Typing...</span>
                              ) : (
                                conversation.lastMessage
                              )}
                            </p>
                            {conversation.unreadCount ? (
                              <Badge className="ml-2 bg-blue-600">{conversation.unreadCount}</Badge>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <p>No conversations found</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Conversation Header */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activeContact.avatar} />
                      <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">{activeContact.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isTyping ? (
                          <span className="text-green-500">Typing...</span>
                        ) : (
                          activeContact.isOnline ? 'Active now' : activeContact.lastActive || 'Offline'
                        )}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setActiveContact(null)} 
                    className="h-8 w-8 p-0 dark:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Messages */}
                <div className="h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
                  {messages[activeContact.id]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.sender === 'contact' && (
                        <Avatar className="h-8 w-8 mr-2 mt-1">
                          <AvatarImage src={activeContact.avatar} />
                          <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className="max-w-[70%]">
                        {/* Attachments */}
                        {message.attachments?.map((attachment, i) => (
                          <div key={i} className="mb-1">
                            {attachment.type === 'image' ? (
                              <div className="rounded-lg overflow-hidden">
                                <img 
                                  src={attachment.url} 
                                  alt="Attachment" 
                                  className="max-w-full h-auto rounded-lg"
                                />
                              </div>
                            ) : attachment.type === 'sticker' ? (
                              <div className="text-4xl">
                                {attachment.url}
                              </div>
                            ) : attachment.type === 'audio' ? (
                              <div className="bg-gray-100 p-3 rounded-lg flex items-center space-x-2 dark:bg-gray-700">
                                <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900">
                                  <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium dark:text-white">Voice Message</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">0:12</p>
                                </div>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-auto">
                                  <Play className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : null}
                          </div>
                        ))}

                        {/* Message content */}
                        {message.content && (
                          <div
                            className={`p-3 rounded-lg ${
                              message.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-900 rounded-bl-none shadow-sm dark:bg-gray-800 dark:text-white'
                            }`}
                          >
                            <p className="text-sm break-words">{message.content}</p>
                          </div>
                        )}

                        {/* Timestamp and status */}
                        <div className={`flex items-center mt-1 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(message.timestamp)}</p>
                          {message.sender === 'user' && (
                            <div className="ml-1">
                              {getStatusIcon(message.status)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Emoji picker */}
                <AnimatePresence>
                  {showEmojiPicker && (
                    <EmojiPicker onSelect={handleEmojiSelect} />
                  )}
                </AnimatePresence>
                
                {/* Attachment options */}
                <AnimatePresence>
                  {showAttachmentOptions && (
                    <AttachmentOptions 
                      onSendImage={handleSendImage}
                      onSendFile={handleSendFile}
                      onSendSticker={() => setShowEmojiPicker(true)}
                      onSendVoice={handleVoiceMessage}
                    />
                  )}
                </AnimatePresence>
                
                {/* Message Input */}
                <div className="p-3 border-t dark:border-gray-700 flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setShowAttachmentOptions(!showAttachmentOptions);
                      setShowEmojiPicker(false);
                    }}
                    className="h-8 w-8 p-0 mr-1 dark:text-gray-300"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input 
                    placeholder="Aa"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setShowEmojiPicker(!showEmojiPicker);
                      setShowAttachmentOptions(false);
                    }}
                    className="h-8 w-8 p-0 mx-1 dark:text-gray-300"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="default"
                    size="sm" 
                    onClick={handleSendMessage}
                    className="h-8 w-8 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Hidden file input for image upload */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Message Dialog */}
      <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 dark:text-gray-200">To:</label>
              <Input
                placeholder="Enter name or search contacts"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setIsNewMessageOpen(false)}
                className="dark:border-gray-600 dark:text-gray-200"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendNewMessage}
                disabled={!newContactName.trim()}
              >
                Start Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
});

// Search icon component
const Search = ({ className }: { className?: string }) => (
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// Play icon component
const Play = ({ className }: { className?: string }) => (
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
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
