import { formatRoute } from '../../utils/stringFormats';
import api from '../api';
import { Entity, Person, Player, PendingPlayer, Practice, Role, Roster } from '../../../../typescript/types';

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

export async function updatePlayer(id: string, role: string): Promise<number> {
  const { status } = await api(`${BASE_URL}/player`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      role,
    }),
  });
  return status;
}

export async function updatePractice(
  id: string,
  name: string,
  dateStart: string | null,
  dateEnd: string | null,
  newLocation: string | undefined,
  locationId: string | null,
  address: string | undefined
): Promise<number> {
  const { status } = await api(`${BASE_URL}/practice`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      name,
      dateStart,
      dateEnd,
      newLocation,
      locationId,
      address,
    }),
  });
  return status;
}

export async function updateRoster(
  players: Pick<Person, 'id' | 'completeName' | 'photoUrl'>[],
  id: string,
  name: string
): Promise<number> {
  const { status } = await api(`${BASE_URL}/roster`, {
    method: 'PUT',
    body: JSON.stringify({
      players,
      id,
      name,
    }),
  });
  return status;
}

export async function addRoster(
  teamId: string,
  players: Pick<Person, 'id' | 'completeName' | 'photoUrl'>[],
  name: string
): Promise<number> {
  const res = await api(`${BASE_URL}/roster`, {
    method: 'POST',
    body: JSON.stringify({
      teamId,
      players,
      name,
    }),
  });
  return res.status;
}

export async function addPlayers(teamId: string, players: Player[]): Promise<number> {
  const { status } = await api(`${BASE_URL}/players`, {
    method: 'POST',
    body: JSON.stringify({
      teamId,
      players,
    }),
  });
  return status;
}

export async function sendRequestToJoinTeam(teamId: string, personId: string): Promise<number> {
  const { status } = await api(`${BASE_URL}/joinTeam`, {
    method: 'POST',
    body: JSON.stringify({
      teamId,
      personId,
    }),
  });
  return status;
}

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
