import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import {
  Entity,
  Player,
  PendingPlayer,
  OwnedEvents,
  Practice,
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
  Exercise,
  EventTeam,
} from '../../../../../typescript/types';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';

const BASE_URL = '/api/entity';

export function getEntity(id: string): Promise<Entity> {
  return api(formatRoute(`${BASE_URL}`, null, { id })).then((res) => res.data.basicInfos);
}

export function getEntityEvents(organizationId: string): Promise<OwnedEvents[]> {
  return api(formatRoute(`${BASE_URL}/ownedEvents`, null, { organizationId })).then((res) => res.data);
}

export function getFields(eventId: string): Promise<Field[]> {
  return api(formatRoute(`${BASE_URL}/fields`, null, { eventId })).then((res) => res.data);
}

export function getGames(eventId: string): Promise<Games[]> {
  return api(formatRoute(`${BASE_URL}/games`, null, { eventId })).then((res) => res.data);
}

export function getGameInfo(gameId: string): Promise<GameInfo> {
  return api(formatRoute(`${BASE_URL}/gameInfo`, null, { gameId })).then((res) => res.data);
}

export function getGeneralInfos(entityId: string): Promise<Entity> {
  return api(formatRoute(`${BASE_URL}/generalInfos`, null, { entityId })).then((res) => res.data);
}

export function getRole(entityId: string): Promise<{ status: string; data: ENTITIES_ROLE_ENUM }> {
  return api(formatRoute(`${BASE_URL}/role`, null, { entityId })).then((res) => res);
}

export function getRoles(id: string): Promise<{ status: string; data: EntityRole[] }> {
  return api(`${BASE_URL}/roles?id=${id}`).then((res) => res);
}

export function getSlots(eventId: string): Promise<TimeSlot[]> {
  return api(formatRoute('/api/entity/slots', null, { eventId })).then((res) => res.data);
}

export function getMostRecentMember(organizationId: string): Promise<Member> {
  return api(formatRoute(`${BASE_URL}/recentMember`, null, { organizationId })).then((res) => res.data);
}

export function hasMemberships(organizationId: string): Promise<boolean> {
  return api(formatRoute(`${BASE_URL}/hasMemberships`, null, { organizationId })).then((res) => res.data);
}

export function getPlayers(teamId: string): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/players`, null, { teamId })).then((res) => res.data);
}

export function getAllTeamsRegisteredInfos(eventId: string): Promise<EventTeam[]> {
  return api(formatRoute(`${BASE_URL}/allTeamsRegisteredInfos`, null, { eventId })).then((res) => res.data);
}

export function getAllTeamsAcceptedRegistered(eventId: string): Promise<EventTeam[]> {
  return api(formatRoute(`${BASE_URL}/allTeamsAcceptedRegistered`, null, { eventId })).then((res) => res.data);
}

export function getCanUnregisterTeamsList(eventId: string, rosterIds: string[]): Promise<EventTeam[]> {
  return api(
    formatRoute(`${BASE_URL}/canUnregisterTeamsList`, null, { eventId, rosterIds: JSON.stringify(rosterIds) })
  ).then((res) => res.data);
}

export function getEventInfo(eventId: string): Promise<Event> {
  return api(formatRoute(`${BASE_URL}/event`, null, { eventId })).then((res) => res.data);
}

export function getTeamPlayersPending(teamId: string): Promise<PendingPlayer[]> {
  return api(formatRoute(`${BASE_URL}/teamPlayersPending`, null, { teamId })).then((res) => res.data);
}

export function getMyTeamPlayersRequest(teamId: string): Promise<PendingPlayer[]> {
  return api(formatRoute(`${BASE_URL}/myTeamPlayersRequest`, null, { teamId })).then((res) => res.data);
}

export function getMembers(organizationId: string, personId: string): Promise<Member[]> {
  return api(formatRoute(`${BASE_URL}/members`, null, { organizationId, personId })).then((res) => res.data);
}

export function getMemberships(id: string): Promise<EntityMembership[]> {
  return api(formatRoute(`${BASE_URL}/memberships`, null, { id })).then((res) => res.data);
}

export function getPartners(id: string): Promise<Partner[]> {
  return api(formatRoute(`${BASE_URL}/partners`, null, { id })).then((res) => res.data);
}

export function getPhases(eventId: string): Promise<Phase[]> {
  return api(formatRoute(`${BASE_URL}/phases`, null, { eventId })).then((res) => res.data);
}

export function getPhasesGameAndTeams(eventId: string, phaseId: string): Promise<PhaseGameAndTeams> {
  return api(formatRoute(`${BASE_URL}/phasesGameAndTeams`, null, { eventId, phaseId })).then((res) => res.data);
}

export function getPracticeBasicInfo(teamId: string): Promise<Practice[]> {
  return api(formatRoute(`${BASE_URL}/practiceBasicInfo`, null, { teamId })).then((res) => res.data);
}

export function getPossibleSubmissionerInfos(game: GameInfo): Promise<{ status: number; data: SubmissionerInfos[] }> {
  return api(
    formatRoute(`${BASE_URL}/getPossibleSubmissionerInfos`, null, {
      gameId: game.id,
      teamsIds: JSON.stringify(game.positions.map((t) => ({ rosterId: t.rosterId, name: t.name }))),
    })
  ).then((res) => res);
}

export function getPracticeInfo(practiceId: string): Promise<{ practice: Practice; role: number }> {
  return api(formatRoute(`${BASE_URL}/practiceInfo`, null, { practiceId })).then((res) => res.data);
}

export function getRosters(teamId: string): Promise<Roster[]> {
  return api(formatRoute(`${BASE_URL}/rosters`, null, { teamId })).then((res) => res.data);
}

export function getRosterPlayers(rosterId: string): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/rosterPlayers`, null, { rosterId })).then((res) => res.data);
}

export function getRecentMember(id: string): Promise<Member> {
  return api(formatRoute(`${BASE_URL}/recentMember`, null, { id })).then((res) => res.data);
}

export function getHasMemberships(id: string): Promise<boolean> {
  return api(formatRoute(`${BASE_URL}/hasMemberships`, null, { id })).then((res) => res.data);
}

export function getEntityOwned(type: number): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/allOwned`, null, { type, onlyAdmin: true })).then((res) => res.data);
}

export function getMyTeamPlayers(teamId: string): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/myTeamPlayers`, null, { teamId })).then((res) => res.data);
}

export function getTeamExercises(teamId: string): Promise<Exercise[]> {
  return api(
    formatRoute(`${BASE_URL}/teamExercises`, null, {
      teamId,
    })
  ).then((res) => res.data);
}

export function getSessionExercises(sessionId: string): Promise<Exercise[]> {
  return api(
    formatRoute(`${BASE_URL}/sessionExercises`, null, {
      sessionId,
    })
  ).then((res) => res.data);
}
