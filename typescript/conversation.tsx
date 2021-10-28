import { Person } from './entity';

export interface Message {
  id: string;
  sender: Participant;
  sentAt: string;
  content: string;
}

export interface Participant {
  id: string;
  name: string;
  surname: string;
  nickname?: string;
  photoUrl: string;
}
export interface ConversationPreview {
  id: string; //conversationId
  lastMessage: Message;
  name?: string;
  nickName?: string;
  participants: Participant[];
}

export interface Conversation {
  id: string;
  messages: Message[];
  participants: Participant[];
}
