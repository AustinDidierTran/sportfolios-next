import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import {
  Entity,
  Player,
  PendingPlayer,
  OwnedEvents,
  Practice,
  Role,
  Roster,
  TimeSlot,
  EntityRole,
  Member,
  EntityMembership,
  PhaseGameAndTeams,
  Partner,
  SubmissionerInfos,
  GameInfo,
  Phase,
  Games,
  Field,
} from '../../../../../typescript/types';

const BASE_URL = '/api/entity';

export async function getEntity(id: string): Promise<Entity> {
  const { data } = await api(
    formatRoute(`${BASE_URL}`, null, {
      id,
    })
  );
  return data.basicInfos;
}

export async function getEntityEvents(organizationId: string): Promise<OwnedEvents[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/ownedEvents`, null, {
      organizationId,
    })
  );

  return data;
}

export async function getFields(eventId: string): Promise<Field[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/fields`, null, {
      eventId,
    })
  );

  return data;
}

export async function getGames(eventId: string): Promise<Games[]> {
  const { data } = await api(formatRoute(`${BASE_URL}/games`, null, { eventId }));
  return data;
}

export async function getGameInfo(gameId: string): Promise<GameInfo> {
  const { data } = await api(formatRoute(`${BASE_URL}/gameInfo`, null, { gameId }));
  return data;
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

export async function getRoles(id: string): Promise<{ status: string; data: EntityRole[] }> {
  const res = await api(`${BASE_URL}/roles?id=${id}`);
  return res;
}

export async function getSlots(eventId: string): Promise<TimeSlot[]> {
  const { data } = await api(formatRoute('/api/entity/slots', null, { eventId }));
  return data;
}

export async function getMostRecentMember(id: string): Promise<Member> {
  const { data } = await api(formatRoute(`${BASE_URL}/recentMember`, null, { id }));
  return data;
}

export async function hasMemberships(id: string): Promise<boolean> {
  const { data } = await api(formatRoute(`${BASE_URL}/hasMemberships`, null, { id }));
  return data;
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

export async function getMembers(organizationId: string, personId: string): Promise<Member[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/members`, null, {
      organizationId,
      personId,
    })
  );

  return data;
}

export async function getMemberships(id: string): Promise<EntityMembership[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/memberships`, null, {
      id,
    })
  );

  return data;
}

export async function getPartners(id: string): Promise<Partner[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/partners`, null, {
      id,
    })
  );

  return data;
}

export async function getPhases(eventId: string): Promise<Phase[]> {
  const { data } = await api(formatRoute(`${BASE_URL}/phases`, null, { eventId }));

  return data;
}

export async function getPhasesGameAndTeams(eventId: string, phaseId: string): Promise<PhaseGameAndTeams> {
  const { data } = await api(formatRoute(`${BASE_URL}/phasesGameAndTeams`, null, { eventId, phaseId }));

  return data;
}

export async function getPracticeBasicInfo(teamId: string): Promise<Practice[]> {
  const { data } = await api(formatRoute(`${BASE_URL}/practiceBasicInfo`, null, { teamId }));
  return data;
}

export function getPossibleSubmissionerInfos(game: GameInfo): Promise<{ status: number; data: SubmissionerInfos[] }> {
  const res = api(
    formatRoute(`${BASE_URL}/getPossibleSubmissionerInfos`, null, {
      gameId: game.id,
      teamsIds: JSON.stringify(
        game.positions.map((t) => ({
          rosterId: t.rosterId,
          name: t.name,
        }))
      ),
    })
  );

  return res;
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

export async function getRecentMember(id: string): Promise<Member> {
  const { data } = await api(formatRoute(`${BASE_URL}/recentMember`, null, { id }));
  return data;
}

export async function getHasMemberships(id: string): Promise<boolean> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/hasMemberships`, null, {
      id,
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
