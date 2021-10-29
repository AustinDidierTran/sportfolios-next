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
export interface IConversationPreview {
  id: string; //conversationId
  lastMessage: Message;
  name?: string;
  nickName?: string;
  participants: Participant[];
}

export interface IConversation {
  id: string;
  name: string;
  messages: Message[];
  participants: Participant[];
}
