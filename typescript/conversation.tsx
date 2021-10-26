import { Person } from './entity';

export interface Message {
  id: string;
  sender: Person;
  sentAt: string;
  content: string;
}

export interface ConversationPreview {
  id: string; //conversationId
  lastMessage: Message;
}

export interface Conversation {
  id: string;
  messages: Message[];
  participants: Person[];
}
