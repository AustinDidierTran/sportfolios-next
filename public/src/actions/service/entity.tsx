import { formatRoute } from '../../utils/stringFormats';
import api from '../api';
import { Person, Player, Roster } from '../../../../typescript/types';

const BASE_URL = '/api/entity';

export async function getPlayers(teamId: string): Promise<Player[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/players`, null, {
      teamId,
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
  const { status } = await api(
    formatRoute(`${BASE_URL}/player`, null, {
      id,
      role,
    }),
    {
      method: 'PUT',
    }
  );
  return status;
}

export async function updateRoster(
  players: Pick<Person, 'id' | 'completeName' | 'photoUrl'>[],
  id: string,
  name: string
): Promise<number> {
  const { status } = await api(
    formatRoute(`${BASE_URL}/roster`, null, {
      players,
      id,
      name,
    }),
    {
      method: 'PUT',
    }
  );
  return status;
}

export async function addRoster(teamId: string, players: Player[], name: string): Promise<number> {
  const { status } = await api(
    formatRoute(`${BASE_URL}/roster`, null, {
      teamId,
      players,
      name,
    }),
    {
      method: 'POST',
    }
  );
  return status;
}

export async function addPlayers(teamId: string, players: Player[]): Promise<number> {
  const { status } = await api(
    formatRoute(`${BASE_URL}/players`, null, {
      teamId,
      players,
    }),
    {
      method: 'POST',
    }
  );
  return status;
}

export async function deletePlayer(id: string): Promise<number> {
  const { status } = await api(
    formatRoute(`${BASE_URL}/players`, null, {
      id,
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
