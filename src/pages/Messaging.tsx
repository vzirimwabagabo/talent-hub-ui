// src/pages/Messaging.tsx

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getConversations,
  startConversation,
  getConversationMessages,
} from '@/api/conversationApi';
import { sendMessage } from '@/api/messageApi';
import { getAllUsers } from '@/api/userApi';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Conversation } from '@/types/conversation';
import type { Message } from '@/types/message';
import type { User as UserType } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';

const Messaging = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations - fixed circular dependency
  const loadConversations = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const result = await getConversations();
      //console.log(result);
      if (result.success) {
        setConversations(result.data || []);
        // Set active conversation only if none exists
        setActiveConversation(current => current || result.data?.[0] || null);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]); // Removed activeConversation dependency

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Load all users with proper cleanup and conditions
  useEffect(() => {
    let mounted = true;
    
    const fetchUsers = async () => {
      //console.log(user, isLoadingUsers);
      if (!user?.id || isLoadingUsers) return;
      
      setIsLoadingUsers(true);
      try {
        const result = await getAllUsers();
        //console.log("Users: ", result);
        if (mounted && result.success) {
          const others = result.data?.filter(u => u._id !== user.id) || [];
          setUsers(others);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        if (mounted) {
          setIsLoadingUsers(false);
        }
      }
    };
    
    fetchUsers();
    
    return () => {
      mounted = false;
    };
  }, [user?.id]); // Only depend on user ID

  // Load messages for active conversation
  useEffect(() => {
    let mounted = true;
    
    const loadMessages = async () => {
      if (!activeConversation) {
        setMessages([]);
        return;
      }
      
      try {
        const result = await getConversationMessages(activeConversation.id);
        if (mounted && result.success) {
          setMessages(result.data || []);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };
    
    loadMessages();
    
    return () => {
      mounted = false;
    };
  }, [activeConversation]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // changing the messaging 

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation?.id || !user || isSending) return;
    // no comments
    setIsSending(true);
    try {
      const result = await sendMessage({
        conversationId: activeConversation.id,
        senderId:user.id,
        content: newMessage,
      });
      
      if (result.success && result.data) {
        setNewMessage('');
        setMessages(prev => [...prev, result.data!]);

        // Optimized conversation update
        setConversations(prev =>
          prev.map(conv =>
            conv.id === activeConversation.id
              ? {
                  ...conv,
                  lastMessage: {
                    content: result.data!.content,
                    senderId: user._id,
                    sentAt: new Date().toISOString(),
                  },
                }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleStartConversation = async (participantId: string) => {

    if (!user || isStarting) return;

    
    
    setIsStarting(true);
    try {
      // Check for existing conversation
      const existing = conversations.find(conv =>
        conv.participants.some(p => p.id === participantId)
      );
      
      if (existing) {
        setActiveConversation(existing);
        return;
      }
      
      const result = await startConversation({ participantId });
      if (result.success && result.data) {
        const newConv = result.data;
        setConversations(prev => [newConv, ...prev]);
        setActiveConversation(newConv);
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const otherUser = activeConversation
    ? activeConversation.participants.find(p => p.id !== user?._id)
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <Card className="flex flex-col h-[95vh] border-border/50 shadow-large">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          {/* Start Chat Bar */}
          <div className="w-full border-b border-border/50 py-3 px-4 bg-muted/30 overflow-x-auto">
            <div className="flex items-center gap-4 min-w-max">
              <div className="flex gap-3">
                {users.map(userItem => (
                  <div key={userItem._id} className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 p-0 rounded-full hover:bg-primary/10"
                      onClick={() => handleStartConversation(userItem._id)}
                      disabled={isStarting || isLoadingUsers}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userItem.avatar} alt={userItem.name} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                    <span className="text-xs max-w-[80px] truncate text-center">
                      {userItem.name}
                    </span>
                  </div>
                ))}
                {isLoadingUsers && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
                    <span className="text-xs text-muted-foreground">Loading...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Conversations List */}
            <div className="w-full md:w-1/3 border-r border-border/50 flex flex-col">
              {conversations.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-1">No conversations yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start a chat from the bar above.
                  </p>
                </div>
              ) : (
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {conversations.map(conv => {
                      const other = conv.participants.find(p => p.id !== user?.id);
                      return (
                        <button
                          key={conv.id}
                          onClick={() => setActiveConversation(conv)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                            activeConversation?.id === conv.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={other?.avatar} alt={other?.name} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <p className="font-medium truncate">{other?.name}</p>
                              {conv.lastMessage?.sentAt && (
                                <span className="text-xs text-muted-foreground">
                                  {new Date(conv.lastMessage.sentAt).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage?.content || 'New conversation'}
                            </p>
                          </div>
                          {conv.unreadCount > 0 && (
                            <Badge 
                              variant="destructive" 
                              className="h-5 w-5 p-0 flex items-center justify-center min-w-[20px]"
                            >
                              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                            </Badge>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Message Thread */}
            <div className="hidden md:flex flex-col flex-1">
              {activeConversation && otherUser ? (
                <>
                  <div className="p-4 border-b border-border/50 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{otherUser.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {otherUser.role === 'participant' ? 'Talent' : otherUser.supporterType}
                      </p>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const isOwn = msg.sender.id === user?.id;
                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "max-w-xs md:max-w-md p-3 rounded-2xl relative",
                              isOwn
                                ? "ml-auto bg-primary text-primary-foreground"
                                : "bg-muted"
                            )}
                          >
                            <div className="whitespace-pre-wrap break-words">
                              {msg.content}
                            </div>
                            <div
                              className={cn(
                                "text-xs mt-1 opacity-80",
                                isOwn ? "text-primary-foreground/80 text-right" : "text-muted-foreground"
                              )}
                            >
                              {new Date(msg.sentAt).toLocaleTimeString([], { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-border/50 w-full">
                    <div className="flex gap-2 w-full flex-row">
                      <Input
                        value={newMessage}
                        
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !isSending) {
                            handleSendMessage();
                          }
                        }}
                        className="flex-1 w-[90%]"
                        disabled={isSending}
                      />
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || isSending}
                        className="h-10 w-10"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground max-w-md">
                    Choose a conversation from the list to start messaging.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="md:hidden mt-4 text-center text-sm text-muted-foreground">
        <p>Switch to desktop for full messaging experience</p>
      </div>
    </div>
  );
};

export default Messaging;