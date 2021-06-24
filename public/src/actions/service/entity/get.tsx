import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import { Entity, Player, PendingPlayer, Practice, Role, Roster } from '../../../../../typescript/types';

const BASE_URL = '/api/entity';

export async function getEntity(id: string): Promise<Entity> {
  const { data } = await api(
    formatRoute(`${BASE_URL}`, null, {
      id,
    })
  );
  return data.basicInfos;
}

export async function getGeneralInfos(entityId: string): Promise<Entity> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/generalInfos`, null, {
      entityId,
    })
  );
  return data;
}

export async function getRole(entityId: string): Promise<{ status: string; data: Role }> {
  const res = await api(formatRoute(`${BASE_URL}/role`, null, { entityId }));
  return res;
}

export async function getPlayers(teamId: string): Promise<Player[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/players`, null, {
      teamId,
    })
  );
  return data;
}

export async function getTeamPlayersPending(teamId: string): Promise<PendingPlayer[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/teamPlayersPending`, null, {
      teamId,
    })
  );
  return data;
}

export async function getPracticeBasicInfo(teamId: string): Promise<Practice[]> {
  const { data } = await api(formatRoute(`${BASE_URL}/practiceBasicInfo`, null, { teamId }));
  return data;
}

export async function getPracticeInfo(practiceId: string): Promise<{ practice: Practice; role: number }> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/practiceInfo`, null, {
      practiceId,
    })
  );
  return data;
}

export async function getRosters(teamId: string): Promise<Roster[]> {
  const { rosters } = await api(
    formatRoute(`${BASE_URL}/rosters`, null, {
      teamId,
    })
  );
  return rosters;
}

export async function getRosterPlayers(rosterId: string): Promise<Player[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/rosterPlayers`, null, {
      rosterId,
    })
  );
  return data;
}

export async function getEntityOwned(type: number): Promise<Player[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/allOwned`, null, {
      type,
      onlyAdmin: true,
    })
  );
  return data;
}

export async function getMyTeamPlayers(teamId: string): Promise<Player[]> {
  const { data } = await api(formatRoute(`${BASE_URL}/myTeamPlayers`, null, { teamId }));
  return data;
}
