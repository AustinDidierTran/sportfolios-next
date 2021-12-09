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
  nickName?: string;
  participants: Participant[];
}

export interface IConversation {
  conversation: IConversationPreview;
  messages: IConversationMessage[];
}

export interface Recipient {
  id: string;
  name: string;
  type: number;
  personId?: string;
  surname?: string;
  photoUrl: string;
}
