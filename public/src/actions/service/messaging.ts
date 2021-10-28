import api from '../api';
import { formatRoute } from '../../utils/stringFormats';
import { IConversationPreview, Conversation } from '../../../../typescript/conversation';

const BASE_URL = '/api/messaging';

export async function getConversations({
  page,
  recipientId,
  searchQuery,
}: {
  page?: number;
  recipientId: string;
  searchQuery?: string;
}): Promise<IConversationPreview[]> {
  return api(formatRoute(BASE_URL, null, { page, recipientId, searchQuery }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export async function getConversationMessages(conversationId: string, page?: number): Promise<Conversation> {
  return api(formatRoute(`${BASE_URL}/messages`, null, { conversationId, page }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export async function sendMessage(conversationId: string, content: string, senderId: string): Promise<void> {
  return api(`${BASE_URL}/message`, {
    method: 'POST',
    body: JSON.stringify({ conversationId, content, senderId }),
  }).then((res) => res.data);
}

export async function createConversation(participantIds: string[], creatorId: string): Promise<string> {
  return api(`${BASE_URL}/conversation`, {
    method: 'POST',
    body: JSON.stringify({ participantIds, creatorId }),
  }).then((res) => res.data);
}
