import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  MicOff,
  Image,
  File,
  X,
  Reply,
  Camera
} from 'lucide-react';
import { toast } from 'sonner';
import { messagingService, Message } from '@/services/MessagingService';

interface MessageComposerProps {
  conversationId: string;
  replyTo?: Message;
  onCancelReply?: () => void;
  onSendMessage?: (content: string, attachments?: { id: string; type: 'image' | 'file' | 'audio' | 'video'; url: string; name: string; size: number; }[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface FileAttachment {
  id: string;
  file: File;
  type: 'image' | 'file' | 'video' | 'audio';
  preview?: string;
  uploading?: boolean;
}

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩',
  '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
  '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬',
  '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
  '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯',
  '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
  '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈',
  '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾'
];

const MessageComposer: React.FC<MessageComposerProps> = ({
  conversationId,
  replyTo,
  onCancelReply,
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Handle typing indicator
  useEffect(() => {
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      messagingService.sendTypingIndicator(conversationId, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        messagingService.sendTypingIndicator(conversationId, false);
      }
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, conversationId, isTyping]);

  const handleSendMessage = useCallback(async () => {
    if ((!message.trim() && attachments.length === 0) || disabled) return;

    try {
      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        messagingService.sendTypingIndicator(conversationId, false);
      }

      // Prepare attachments
      const messageAttachments = attachments.map(att => ({
        id: att.id,
        type: att.type,
        url: att.preview || URL.createObjectURL(att.file),
        name: att.file.name,
        size: att.file.size,
        thumbnail: att.type === 'image' ? att.preview : undefined
      }));

      // Call parent handler to send message
      onSendMessage?.(message.trim(), messageAttachments.length > 0 ? messageAttachments : undefined);
      
      // Clear form
      setMessage('');
      setAttachments([]);
      onCancelReply?.();

      toast.success('Message sent!');
    } catch (_error) {
      // Error already handled by toast notification
      toast.error('Failed to send message');
    }
  }, [message, attachments, conversationId, disabled, isTyping, onCancelReply, onSendMessage]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'image') => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const attachment: FileAttachment = {
        id: `att-${Date.now()}-${Math.random()}`,
        file,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' :
              file.type.startsWith('audio/') ? 'audio' : 'file'
      };

      // Create preview for images
      if (attachment.type === 'image') {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [...prev, attachment]);
      }
    });

    // Reset input
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const file = new File([blob], `voice-${Date.now()}.wav`, { type: 'audio/wav' });
        
        const attachment: FileAttachment = {
          id: `att-${Date.now()}`,
          file,
          type: 'audio'
        };
        
        setAttachments(prev => [...prev, attachment]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (_error) {
      // Error already handled by toast notification
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Reply indicator */}
      {replyTo && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <Reply className="h-4 w-4 text-gray-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              Replying to {replyTo.senderId === 'current-user' ? 'yourself' : 'message'}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {replyTo.content}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelReply}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((attachment) => (
            <div key={attachment.id} className="relative">
              {attachment.type === 'image' && attachment.preview ? (
                <div className="relative">
                  <img
                    src={attachment.preview}
                    alt="Preview"
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-gray-100 p-2">
                  <File className="h-6 w-6 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate max-w-32">
                      {attachment.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(attachment.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-700">
              Recording... {formatRecordingTime(recordingTime)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={stopRecording}
            className="ml-auto"
          >
            Stop
          </Button>
        </div>
      )}

      {/* Message input */}
      <div className="flex items-end gap-2">
        {/* Attachment buttons */}
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={disabled}
                  className="h-9 w-9 p-0"
                >
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add photo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled}
                  className="h-9 w-9 p-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Attach file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Message input area */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isRecording}
            className="min-h-[40px] max-h-[120px] resize-none pr-10"
            rows={1}
          />
          
          {/* Emoji picker */}
          <Dialog open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                disabled={disabled}
              >
                <Smile className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-80 p-4">
              <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
                {EMOJI_LIST.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => insertEmoji(emoji)}
                    className="h-8 w-8 p-0 text-lg hover:bg-gray-100"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Voice recording button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isRecording ? "destructive" : "ghost"}
                size="sm"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={disabled}
                className="h-9 w-9 p-0"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isRecording ? 'Stop recording' : 'Record voice message'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Send button */}
        <Button
          onClick={handleSendMessage}
          disabled={(!message.trim() && attachments.length === 0) || disabled || isRecording}
          size="sm"
          className="h-9 w-9 p-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={(e) => handleFileSelect(e, 'file')}
        className="hidden"
        accept="*/*"
      />
      <input
        ref={imageInputRef}
        type="file"
        multiple
        onChange={(e) => handleFileSelect(e, 'image')}
        className="hidden"
        accept="image/*"
      />
    </div>
  );
};

export default MessageComposer;