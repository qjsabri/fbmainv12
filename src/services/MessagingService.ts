import { toast } from 'sonner';

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'audio' | 'video' | 'sticker' | 'gif';
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
  reactions?: {
    emoji: string;
    userId: string;
    timestamp: Date;
  }[];
  attachments?: {
    id: string;
    type: 'image' | 'file' | 'audio' | 'video';
    url: string;
    name: string;
    size: number;
    thumbnail?: string;
  }[];
  isEdited?: boolean;
  editedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isTyping: { [userId: string]: boolean };
  isMuted: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    theme?: string;
    nickname?: { [userId: string]: string };
    emoji?: string;
  };
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}

export interface MessageReaction {
  messageId: string;
  emoji: string;
  userId: string;
  timestamp: Date;
}

class MessagingService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private typingTimeout: NodeJS.Timeout | null = null;
  
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message[]> = new Map();
  private currentUserId: string = 'current-user';
  
  // Event listeners
  private listeners: {
    [event: string]: ((data: unknown) => void)[];
  } = {};

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    try {
      // In a real app, this would be your WebSocket server URL
      this.ws = new WebSocket('ws://localhost:8080/ws/messages');
      
      this.ws.onopen = this.handleWebSocketOpen.bind(this);
      this.ws.onmessage = this.handleWebSocketMessage.bind(this);
      this.ws.onclose = this.handleWebSocketClose.bind(this);
      this.ws.onerror = this.handleWebSocketError.bind(this);
    } catch {
      // Fallback to mock implementation for demo
      this.initializeMockData();
    }
  }

  private handleWebSocketOpen() {
    this.reconnectAttempts = 0;
    this.startHeartbeat();
    this.emit('connected');
  }

  private handleWebSocketMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'message':
          this.handleNewMessage(data.payload);
          break;
        case 'typing':
          this.handleTypingIndicator(data.payload);
          break;
        case 'reaction':
          this.handleMessageReaction(data.payload);
          break;
        case 'message_status':
          this.handleMessageStatusUpdate(data.payload);
          break;
        case 'user_status':
          this.handleUserStatusUpdate(data.payload);
          break;
        case 'conversation_update':
          this.handleConversationUpdate(data.payload);
          break;
      }
    } catch (_error) {
      console.error('Error parsing WebSocket message:', _error);
    }
  }

  private handleWebSocketClose() {
    this.stopHeartbeat();
    this.emit('disconnected');
    this.attemptReconnect();
  }

  private handleWebSocketError(error: Event) {
    console.error('WebSocket error:', error);
    this.emit('error', error);
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        this.initializeWebSocket();
      }, this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private initializeMockData() {
    // Mock conversations for demo
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        type: 'direct',
        participants: [
          {
            id: 'user-1',
            name: 'Sarah Johnson',
            avatar: '/api/placeholder/40/40',
            isOnline: true
          },
          {
            id: this.currentUserId,
            name: 'You',
            avatar: '/api/placeholder/40/40',
            isOnline: true
          }
        ],
        unreadCount: 2,
        isTyping: {},
        isMuted: false,
        isPinned: false,
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
        settings: {}
      }
    ];

    mockConversations.forEach(conv => {
      this.conversations.set(conv.id, conv);
    });

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'user-1',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 3600000),
        type: 'text',
        status: 'read'
      },
      {
        id: 'msg-2',
        conversationId: 'conv-1',
        senderId: this.currentUserId,
        content: 'I\'m doing great! Thanks for asking.',
        timestamp: new Date(Date.now() - 3000000),
        type: 'text',
        status: 'read'
      }
    ];

    this.messages.set('conv-1', mockMessages);
  }

  // Public API methods
  public sendMessage(conversationId: string, content: string, type: Message['type'] = 'text', attachments?: Message['attachments']) {
    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: this.currentUserId,
      content,
      timestamp: new Date(),
      type,
      status: 'sending',
      attachments
    };

    // Add to local messages immediately
    const conversationMessages = this.messages.get(conversationId) || [];
    conversationMessages.push(message);
    this.messages.set(conversationId, conversationMessages);

    // Emit to listeners
    this.emit('message_sent', message);

    // Send via WebSocket or simulate
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'send_message',
        payload: message
      }));
    } else {
      // Simulate message delivery
      setTimeout(() => {
        message.status = 'delivered';
        this.emit('message_status_updated', message);
      }, 1000);
    }

    return message;
  }

  public sendTypingIndicator(conversationId: string, isTyping: boolean) {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'typing',
        payload: {
          conversationId,
          userId: this.currentUserId,
          isTyping
        }
      }));
    }

    if (isTyping) {
      // Auto-stop typing after 3 seconds
      this.typingTimeout = setTimeout(() => {
        this.sendTypingIndicator(conversationId, false);
      }, 3000);
    }
  }

  public addReaction(messageId: string, emoji: string) {
    const reaction: MessageReaction = {
      messageId,
      emoji,
      userId: this.currentUserId,
      timestamp: new Date()
    };

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'add_reaction',
        payload: reaction
      }));
    } else {
      // Simulate locally
      this.handleMessageReaction(reaction);
    }
  }

  public removeReaction(messageId: string, emoji: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'remove_reaction',
        payload: {
          messageId,
          emoji,
          userId: this.currentUserId
        }
      }));
    }
  }

  public markAsRead(conversationId: string, messageId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'mark_read',
        payload: {
          conversationId,
          messageId,
          userId: this.currentUserId
        }
      }));
    }

    // Update local conversation
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      this.conversations.set(conversationId, conversation);
      this.emit('conversation_updated', conversation);
    }
  }

  public deleteMessage(messageId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'delete_message',
        payload: {
          messageId,
          userId: this.currentUserId
        }
      }));
    }
  }

  public editMessage(messageId: string, newContent: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'edit_message',
        payload: {
          messageId,
          newContent,
          userId: this.currentUserId
        }
      }));
    }
  }

  public createConversation(participants: User[], type: 'direct' | 'group' = 'direct', name?: string): Conversation {
    const conversation: Conversation = {
      id: `conv-${Date.now()}`,
      type,
      name,
      participants,
      unreadCount: 0,
      isTyping: {},
      isMuted: false,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {}
    };

    this.conversations.set(conversation.id, conversation);
    this.messages.set(conversation.id, []);
    
    this.emit('conversation_created', conversation);
    return conversation;
  }

  // Event handling
  private handleNewMessage(message: Message) {
    const conversationMessages = this.messages.get(message.conversationId) || [];
    conversationMessages.push(message);
    this.messages.set(message.conversationId, conversationMessages);

    // Update conversation
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      conversation.lastMessage = message;
      conversation.updatedAt = message.timestamp;
      if (message.senderId !== this.currentUserId) {
        conversation.unreadCount++;
      }
      this.conversations.set(message.conversationId, conversation);
    }

    this.emit('message_received', message);
    
    // Show notification for new messages
    if (message.senderId !== this.currentUserId) {
      const sender = conversation?.participants.find(p => p.id === message.senderId);
      toast.info(`New message from ${sender?.name || 'Unknown'}`);
    }
  }

  private handleTypingIndicator(typing: TypingIndicator) {
    const conversation = this.conversations.get(typing.conversationId);
    if (conversation) {
      conversation.isTyping[typing.userId] = typing.isTyping;
      this.conversations.set(typing.conversationId, conversation);
      this.emit('typing_updated', typing);
    }
  }

  private handleMessageReaction(reaction: MessageReaction) {
    // Find and update the message
    for (const [conversationId, messages] of this.messages.entries()) {
      const messageIndex = messages.findIndex(m => m.id === reaction.messageId);
      if (messageIndex !== -1) {
        const message = messages[messageIndex];
        if (!message.reactions) {
          message.reactions = [];
        }
        
        // Remove existing reaction from this user for this emoji
        message.reactions = message.reactions.filter(
          r => !(r.userId === reaction.userId && r.emoji === reaction.emoji)
        );
        
        // Add new reaction
        message.reactions.push({
          emoji: reaction.emoji,
          userId: reaction.userId,
          timestamp: reaction.timestamp
        });
        
        this.messages.set(conversationId, messages);
        this.emit('message_reaction_updated', message);
        break;
      }
    }
  }

  private handleMessageStatusUpdate(data: { messageId: string; status: Message['status'] }) {
    // Find and update message status
    for (const [conversationId, messages] of this.messages.entries()) {
      const messageIndex = messages.findIndex(m => m.id === data.messageId);
      if (messageIndex !== -1) {
        messages[messageIndex].status = data.status;
        this.messages.set(conversationId, messages);
        this.emit('message_status_updated', messages[messageIndex]);
        break;
      }
    }
  }

  private handleUserStatusUpdate(data: { userId: string; isOnline: boolean; lastSeen?: Date }) {
    // Update user status in all conversations
    for (const [conversationId, conversation] of this.conversations.entries()) {
      const participantIndex = conversation.participants.findIndex(p => p.id === data.userId);
      if (participantIndex !== -1) {
        conversation.participants[participantIndex].isOnline = data.isOnline;
        if (data.lastSeen) {
          conversation.participants[participantIndex].lastSeen = data.lastSeen;
        }
        this.conversations.set(conversationId, conversation);
      }
    }
    
    this.emit('user_status_updated', data);
  }

  private handleConversationUpdate(conversation: Conversation) {
    this.conversations.set(conversation.id, conversation);
    this.emit('conversation_updated', conversation);
  }

  // Getters
  public getConversations(): Conversation[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => {
        // Pinned conversations first
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        
        // Then by last update
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      });
  }

  public getMessages(conversationId: string): Message[] {
    return this.messages.get(conversationId) || [];
  }

  public getConversation(conversationId: string): Conversation | undefined {
    return this.conversations.get(conversationId);
  }

  // Event system
  public on(event: string, callback: (data: unknown) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  public off(event: string, callback: (data: unknown) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  private emit(event: string, data?: unknown) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Cleanup
  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.stopHeartbeat();
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }
}

export const messagingService = new MessagingService();
export default MessagingService;