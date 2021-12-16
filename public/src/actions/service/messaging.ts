import api from '../api';
import { formatRoute } from '../../utils/stringFormats';
import { IConversationPreview, IConversation, Recipient } from '../../../../typescript/conversation';

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
  return api(formatRoute(BASE_URL, null, { recipientId, page, searchQuery }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export async function getConversationMessages(conversationId: string, page?: number): Promise<IConversation> {
  if (!conversationId) {
    return;
  }
  return api(formatRoute(`${BASE_URL}/messages`, null, { conversationId, page }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export async function getAllOwnedEntitiesMessaging(): Promise<Recipient[]> {
  return api(formatRoute(`${BASE_URL}/allOwned`, null, { onlyAdmin: true }), { method: 'GET' }).then((res) => res.data);
}

export async function sendMessage(conversationId: string, content: string, senderId: string): Promise<void> {
  return api(`${BASE_URL}/message`, {
    method: 'POST',
    body: JSON.stringify({ conversationId, content, senderId }),
  }).then((res) => res.data);
}

export async function seeMessages(entityId: string): Promise<void> {
  return api(`${BASE_URL}/seeMessages`, {
    method: 'POST',
    body: JSON.stringify({ entityId }),
  }).then((res) => res.data);
}

export async function seeConversation(entityId: string, conversationId: string): Promise<void> {
  return api(`${BASE_URL}/seeConversation`, {
    method: 'POST',
    body: JSON.stringify({ entityId, conversationId }),
  }).then((res) => res.data);
}

export async function createConversation(participantIds: string[], creatorId: string): Promise<string> {
  return api(`${BASE_URL}/conversation`, {
    method: 'POST',
    body: JSON.stringify({ participantIds, creatorId }),
  }).then((res) => res.data);
}

export async function removeParticipant(conversationId: string, participantId: string): Promise<void> {
  return api(`${BASE_URL}/removeParticipant`, {
    method: 'PUT',
    body: JSON.stringify({ conversationId, participantId }),
  }).then((res) => res.data);
}

export async function addParticipants(conversationId: string, participantIds: string[]): Promise<void> {
  return api(`${BASE_URL}/addParticipants`, {
    method: 'PUT',
    body: JSON.stringify({ conversationId, participantIds }),
  }).then((res) => res.data);
}

export async function updateConversationName(conversationId: string, name: string): Promise<void> {
  return api(`${BASE_URL}/conversationName`, {
    method: 'PUT',
    body: JSON.stringify({ conversationId, name }),
  }).then((res) => res.data);
}

export async function updateNickname(conversationId: string, participantId: string, nickname: string): Promise<void> {
  return api(`${BASE_URL}/nickname`, {
    method: 'PUT',
    body: JSON.stringify({ conversationId, participantId, nickname }),
  }).then((res) => res.data);
}
