import { Person } from './entity';

export interface IConversationMessage {
  id: string;
  conversationId: string;
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
  lastMessage: IConversationMessage;
  name?: string;
  participants: Participant[];
}

export interface IConversation {
  conversation: IConversationPreview;
  messages: IConversationMessage[];
}
