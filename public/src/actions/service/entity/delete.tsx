import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
const BASE_URL = '/api/entity';

export async function deletePlayer(id: string): Promise<number> {
  const { status } = await api(
    formatRoute(`${BASE_URL}/player`, null, {
      id,
    }),
    {
      method: 'DELETE',
    }
  );
  return status;
}

export async function deletePractice(teamId: string, practiceId: string): Promise<number> {
  const { status } = await api(
    formatRoute(`${BASE_URL}/practice`, null, {
      teamId,
      practiceId,
    }),
    {
      method: 'DELETE',
    }
  );
  return status;
}

export async function deleteRosterPlayer(id: string): Promise<number> {
  const { status } = await api(
    formatRoute(`${BASE_URL}/rosterPlayer`, null, {
      id,
    }),
    {
      method: 'DELETE',
    }
  );
  return status;
}

export async function deleteRoster(id: string): Promise<number> {
  const { status } = await api(
    formatRoute('/api/entity/roster', null, {
      id,
    }),
    {
      method: 'DELETE',
    }
  );
  return status;
}

export const deleteEntity = async (id: string, type: string): Promise<void> => {
  api(formatRoute('/api/entity', null, { id, type }), {
    method: 'DELETE',
  });
};
