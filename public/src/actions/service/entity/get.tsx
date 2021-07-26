import { formatRoute } from '../../../utils/stringFormats';
import api from '../../api';
import {
  Entity,
  Player,
  PendingPlayer,
  OwnedEvents,
  Practice,
  Roster,
  EntityRole,
  Member,
  EntityMembership,
  PhaseGameAndTeams,
  Partner,
  SubmissionerInfos,
  GameInfo,
  Phase,
  Games,
  Exercise,
  Evaluation,
  EventTeam,
  Image,
  GameOptions,
  GameSubmissionInfo,
  Preranking,
  PhaseGames,
  AllTeamsAcceptedInfos,
  EventInfos,
  Options,
} from '../../../../../typescript/types';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums';

const BASE_URL = '/api/entity';

export function getEntity(id: string): Promise<Entity> {
  return api(formatRoute(`${BASE_URL}`, null, { id })).then((res) => res.data.basicInfos);
}

export function getEntityEvents(organizationId: string): Promise<OwnedEvents[]> {
  return api(formatRoute(`${BASE_URL}/ownedEvents`, null, { organizationId })).then((res) => res.data);
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

export function getMostRecentMember(organizationId: string): Promise<Member> {
  return api(formatRoute(`${BASE_URL}/recentMember`, null, { organizationId })).then((res) => res.data);
}

export function hasMemberships(organizationId: string): Promise<boolean> {
  return api(formatRoute(`${BASE_URL}/hasMemberships`, null, { organizationId })).then((res) => res.data);
}

export function getPlayers(teamId: string): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/players`, null, { teamId })).then((res) => res.data);
}

export function getAllTeamsRegisteredInfos(eventId: string, pills: string[]): Promise<EventTeam[]> {
  return api(formatRoute(`${BASE_URL}/allTeamsRegisteredInfos`, null, { eventId, pills })).then((res) => res.data);
}

export function getAllTeamsAcceptedRegistered(eventId: string): Promise<EventTeam[]> {
  return api(formatRoute(`${BASE_URL}/allTeamsAcceptedRegistered`, null, { eventId })).then((res) => res.data);
}

export function getCanUnregisterTeamsList(eventId: string, rosterIds: string[]): Promise<string[]> {
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

export function getMyRosters(eventId: string): Promise<{ rosterId: string; name: string }[]> {
  return api(formatRoute(`${BASE_URL}/myRosters`, null, { eventId })).then((res) => res.data);
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

export function getPlayerSessionEvaluation(exerciseId: string, sessionId: string): Promise<Evaluation[]> {
  return api(
    formatRoute(`${BASE_URL}/playerSessionEvaluation`, null, {
      exerciseId,
      sessionId,
    })
  ).then((res) => res.data);
}

export function getIsTeamCoach(teamId: string): Promise<boolean> {
  return api(
    formatRoute(`${BASE_URL}/isTeamCoach`, null, {
      teamId,
    })
  ).then((res) => res.data);
}

export function getCoachSessionEvaluation(exerciseId: string, sessionId: string): Promise<Evaluation[]> {
  return api(
    formatRoute(`${BASE_URL}/coachSessionEvaluation`, null, {
      exerciseId,
      sessionId,
    })
  ).then((res) => res.data);
}

export function getImages(type: string): Promise<Image[]> {
  return api(
    formatRoute(`${BASE_URL}/images`, null, {
      type,
    })
  ).then((res) => res.data);
}

export function getGameOptions(eventId: string): Promise<GameOptions> {
  return api(
    formatRoute(`${BASE_URL}/gameOptions`, null, {
      eventId,
    })
  ).then((res) => res.data);
}

export function getHasSpirit(eventId: string): Promise<boolean> {
  return api(
    formatRoute(`${BASE_URL}/hasSpirit`, null, {
      eventId,
    })
  ).then((res) => res.data.hasSpirit);
}

export function getGameSubmissionInfos(gameId: string, rosterId: string, eventId: string): Promise<GameSubmissionInfo> {
  return api(
    formatRoute(`${BASE_URL}/gameSubmissionInfos`, null, {
      gameId,
      rosterId,
      eventId,
    })
  ).then((res) => res.data);
}

export function getPreranking(eventId: string): Promise<{ preranking: Preranking[]; prerankPhaseId: string }> {
  return api(
    formatRoute(`${BASE_URL}/preranking`, null, {
      eventId,
    })
  ).then((res) => res.data);
}

export function getTeamgames(eventId: string): Promise<PhaseGames[]> {
  return api(
    formatRoute(`${BASE_URL}/teamGames`, null, {
      eventId,
    })
  ).then((res) => res.data);
}

export function getAllTeamsAcceptedInfos(eventId: string): Promise<AllTeamsAcceptedInfos[]> {
  return api(
    formatRoute(`${BASE_URL}/allTeamsAcceptedInfos`, null, {
      eventId,
    })
  ).then((res) => res.data);
}

export function getEvent(id: string): Promise<EventInfos> {
  return api(
    formatRoute(`${BASE_URL}/eventInfos`, null, {
      id,
    })
  ).then((res) => res.data);
}

export function getOptions(eventId: string): Promise<Options[]> {
  return api(
    formatRoute(`${BASE_URL}/options`, null, {
      eventId,
    })
  ).then((res) => res.data);
}

export function getRemainingSpots(id: string): Promise<number> {
  return api(
    formatRoute(`${BASE_URL}/remainingSpots`, null, {
      id,
    })
  ).then((res) => res.data);
}
