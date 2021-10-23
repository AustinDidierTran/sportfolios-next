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
  Report,
  ForYouPagePost,
  User,
  Person,
  Membership,
  Event,
} from '../../../../../typescript/types';
import { ENTITIES_ROLE_ENUM, ROSTER_ROLE_ENUM } from '../../../../common/enums';
import { AnySchema } from 'yup';

const BASE_URL = '/api/entity';

export function getEntity(id: string): Promise<Entity> {
  return api(formatRoute(`${BASE_URL}`, null, { id }), { method: 'GET' }).then((res) => res.data.basicInfos);
}

export function getEntityEvents(organizationId: string): Promise<OwnedEvents[]> {
  return api(formatRoute(`${BASE_URL}/ownedEvents`, null, { organizationId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function globalSearch(body: {
  whiteList?: string[];
  blackList?: string[];
  query: string;
  type: string;
}): Promise<any> {
  return api(formatRoute('/api/search/global', null, body), { method: 'GET' });
}

export function myTeamsSearch(query: string, eventId: string): Promise<any> {
  return api(formatRoute('/api/search/myTeamsSearch', null, { query, eventId }), { method: 'GET' });
}

export function getRoster(rosterId: string, withSub: boolean): Promise<any> {
  return api(formatRoute(`${BASE_URL}/getRoster`, null, { rosterId, withSub }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getUsersAndSecond(offset: number, filter: string): Promise<User> {
  return api(formatRoute('/api/admin/users', null, { offset, filter }), { method: 'GET' }).then((res) => res.data);
}

export function getGames(eventId: string): Promise<Games[]> {
  return api(formatRoute(`${BASE_URL}/games`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
}

export async function getGameInfo(gameId: string): Promise<GameInfo> {
  return api(formatRoute(`${BASE_URL}/gameInfo`, null, { gameId }), { method: 'GET' }).then((res) => res.data);
}

export function getGeneralInfos(entityId: string): Promise<Entity> {
  return api(formatRoute(`${BASE_URL}/generalInfos`, null, { entityId }), { method: 'GET' }).then((res) => res.data);
}

export function getRole(entityId: string): Promise<{ status: number; data: ENTITIES_ROLE_ENUM }> {
  return api(formatRoute(`${BASE_URL}/role`, null, { entityId }), { method: 'GET' });
}

export function getPlayersPendingAndRefused(
  eventId: string
): Promise<{ pending: { id: string }[]; refused: { id: string }[] }> {
  return api(formatRoute(`${BASE_URL}/playersPendingAndRefused`, null, { eventId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getAllPeopleRegisteredInfos(eventId: string): Promise<Person[]> {
  return api(formatRoute(`${BASE_URL}/allPeopleRegisteredInfos`, null, { eventId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getRoles(id: string): Promise<{ status: string; data: EntityRole[] }> {
  return api(formatRoute(`${BASE_URL}/roles`, null, { id }), { method: 'GET' }).then((res) => res);
}

export function getPlayerTeamRole(teamId: string): Promise<{ status: number; data: ROSTER_ROLE_ENUM }> {
  return api(formatRoute(`${BASE_URL}/playerTeamRole`, null, { teamId }), { method: 'GET' });
}

export function getForYouPage(): Promise<{ status: number; data: ForYouPagePost[] }> {
  return api(`${BASE_URL}/forYouPage`, { method: 'GET' }).then((res) => res);
}

export function getMostRecentMember(organizationId: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/recentMember`, null, { organizationId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function hasMemberships(organizationId: string): Promise<boolean> {
  return api(formatRoute(`${BASE_URL}/hasMemberships`, null, { organizationId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getPersonInfos(entityId: string): Promise<Person> {
  return api(formatRoute(`${BASE_URL}/personInfos`, null, { entityId }), { method: 'GET' }).then((res) => res.data);
}

export function getPrimaryPerson(): Promise<Person> {
  return api(formatRoute(`${BASE_URL}/primaryPerson`, null, null), { method: 'GET' }).then((res) => res.data);
}

export function getOwnedPersons(): Promise<Person> {
  return api(formatRoute(`${BASE_URL}/primaryPerson`, null, null), { method: 'GET' }).then((res) => res.data);
}

export function getPlayers(teamId: string): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/players`, null, { teamId }), { method: 'GET' }).then((res) => res.data);
}

export function getAllTeamsRegisteredInfos(eventId: string, pills: string[]): Promise<EventTeam[]> {
  return api(formatRoute(`${BASE_URL}/allTeamsRegisteredInfos`, null, { eventId, pills }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getAllTeamsAcceptedRegistered(eventId: string): Promise<EventTeam[]> {
  return api(formatRoute(`${BASE_URL}/allTeamsAcceptedRegistered`, null, { eventId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getCanUnregisterTeamsList(eventId: string, rosterIds: string[]): Promise<string[]> {
  return api(
    formatRoute(`${BASE_URL}/canUnregisterTeamsList`, null, { eventId, rosterIds: JSON.stringify(rosterIds) }),
    { method: 'GET' }
  ).then((res) => res.data);
}

export function getEventInfo(eventId: string): Promise<Event> {
  return api(formatRoute(`${BASE_URL}/event`, null, { eventId }), { method: 'GET' }).then((res) => ({
    startDate: res.data.startDate,
    endDate: res.data.endDate,
    alias: res.data.alias,
    fields: res.data.fields,
    timeSlots: res.data.timeSlots,
    paymentOptions: res.data.paymentOptions,
    persons: res.data.persons,
    teams: res.data.teams,
    phases: res.data.phases,
    maximumSpots: res.data.maximum_spots,
    id: res.data.id,
    type: res.data.type,
    role: res.data.role,
    name: res.data.name,
    description: res.data.description,
    quickDescription: res.data.quickDescription,
    photoUrl: res.data.photoUrl,
    infosSuppId: res.data.infosSuppId,
    admins: res.data.admins,
    posts: res.data.posts,
  }));
}

export function getAllPlayersAcceptedRegistered(eventId: string): Promise<any> {
  return api(formatRoute(`${BASE_URL}/allPlayersAcceptedRegistered`, null, { eventId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getTeamPlayersPending(teamId: string): Promise<PendingPlayer[]> {
  return api(formatRoute(`${BASE_URL}/teamPlayersPending`, null, { teamId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getMyTeamPlayersRequest(teamId: string): Promise<PendingPlayer[]> {
  return api(formatRoute(`${BASE_URL}/myTeamPlayersRequest`, null, { teamId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getMembers(organizationId: string, personId: string): Promise<Member[]> {
  return api(formatRoute(`${BASE_URL}/members`, null, { organizationId, personId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getMemberships(id: string): Promise<EntityMembership[]> {
  return api(formatRoute(`${BASE_URL}/memberships`, null, { id }), { method: 'GET' }).then((res) => res.data);
}

export function getMembership(organizationId: string, membershipType: number): Promise<Membership> {
  return api(formatRoute(`${BASE_URL}/membership`, null, { organizationId, membershipType }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getMyRosters(eventId: string): Promise<{ rosterId: string; name: string }[]> {
  return api(formatRoute(`${BASE_URL}/myRosters`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
}

export function getPartners(id: string): Promise<Partner[]> {
  return api(formatRoute(`${BASE_URL}/partners`, null, { id }), { method: 'GET' }).then((res) => res.data);
}

export function getPhases(eventId: string): Promise<Phase[]> {
  return api(formatRoute(`${BASE_URL}/phases`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
}

export function getPhasesGameAndTeams(eventId: string, phaseId: string): Promise<PhaseGameAndTeams> {
  return api(formatRoute(`${BASE_URL}/phasesGameAndTeams`, null, { eventId, phaseId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getPrerankPhase(eventId: string): Promise<Phase> {
  return api(formatRoute(`${BASE_URL}/prerankPhase`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
}

export function getPracticeBasicInfo(teamId: string): Promise<Practice[]> {
  return api(formatRoute(`${BASE_URL}/practiceBasicInfo`, null, { teamId }), { method: 'GET' }).then((res) => res.data);
}

export function getPossibleSubmissionerInfos(game: GameInfo): Promise<{ status: number; data: SubmissionerInfos[] }> {
  return api(
    formatRoute(`${BASE_URL}/getPossibleSubmissionerInfos`, null, {
      gameId: game.id,
      teamsIds: JSON.stringify(game.positions.map((t) => ({ rosterId: t.rosterId, name: t.name }))),
    }),
    { method: 'GET' }
  );
}

export function getPracticeInfo(practiceId: string): Promise<Practice> {
  return api(formatRoute(`${BASE_URL}/practiceInfo`, null, { practiceId }), { method: 'GET' }).then((res) => res.data);
}

export function getReports(id: string): Promise<Report[]> {
  return api(formatRoute(`${BASE_URL}/reports`, null, { id }), { method: 'GET' }).then((res) => res.data);
}

export function getRosters(teamId: string): Promise<Roster[]> {
  return api(formatRoute(`${BASE_URL}/rosters`, null, { teamId }), { method: 'GET' }).then((res) => res.data);
}

export function getRosterPlayers(rosterId: string): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/rosterPlayers`, null, { rosterId }), { method: 'GET' }).then((res) => res.data);
}

export function getRecentMember(id: string): Promise<Member> {
  return api(formatRoute(`${BASE_URL}/recentMember`, null, { id }), { method: 'GET' }).then((res) => res.data);
}

export function getHasMemberships(id: string): Promise<boolean> {
  return api(formatRoute(`${BASE_URL}/hasMemberships`, null, { id }), { method: 'GET' }).then((res) => res.data);
}

export function getEntityOwned(type: number): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/allOwned`, null, { type, onlyAdmin: true }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getMyTeamPlayers(teamId: string): Promise<Player[]> {
  return api(formatRoute(`${BASE_URL}/myTeamPlayers`, null, { teamId }), { method: 'GET' }).then((res) => res.data);
}

export function getTeamExercises(teamId: string): Promise<Exercise[]> {
  return api(formatRoute(`${BASE_URL}/teamExercises`, null, { teamId }), { method: 'GET' }).then((res) => res.data);
}

export function getSessionExercises(sessionId: string): Promise<Exercise[]> {
  return api(formatRoute(`${BASE_URL}/sessionExercises`, null, { sessionId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getPlayerSessionEvaluation(exerciseId: string, sessionId: string): Promise<Evaluation[]> {
  return api(formatRoute(`${BASE_URL}/playerSessionEvaluation`, null, { exerciseId, sessionId }), {
    method: 'GET',
  }).then((res) => res.data);
}

export function getIsTeamCoach(teamId: string): Promise<boolean> {
  return api(formatRoute(`${BASE_URL}/isTeamCoach`, null, { teamId }), { method: 'GET' }).then((res) => res.data);
}

export function getCoachSessionEvaluation(exerciseId: string, sessionId: string): Promise<Evaluation[]> {
  return api(formatRoute(`${BASE_URL}/coachSessionEvaluation`, null, { exerciseId, sessionId }), {
    method: 'GET',
  }).then((res) => res.data);
}

export function getImages(type: string): Promise<Image[]> {
  return api(formatRoute(`${BASE_URL}/images`, null, { type }), { method: 'GET' }).then((res) => res.data);
}

export function getGameOptions(eventId: string): Promise<GameOptions> {
  return api(formatRoute(`${BASE_URL}/gameOptions`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
}

export function getHasSpirit(eventId: string): Promise<boolean> {
  if (!eventId) {
    throw new Error('You must provide an event id for spirit');
  }
  return api(formatRoute(`${BASE_URL}/hasSpirit`, null, { eventId }), { method: 'GET' }).then(
    (res) => res.data.hasSpirit
  );
}

export function getGameSubmissionInfos(gameId: string, rosterId: string, eventId: string): Promise<GameSubmissionInfo> {
  return api(formatRoute(`${BASE_URL}/gameSubmissionInfos`, null, { gameId, rosterId, eventId }), {
    method: 'GET',
  }).then((res) => res.data);
}

export function getPreranking(eventId: string): Promise<{ preranking: Preranking[]; prerankPhaseId: string }> {
  return api(formatRoute(`${BASE_URL}/preranking`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
}

export function getTeamgames(eventId: string): Promise<PhaseGames[]> {
  return api(formatRoute(`${BASE_URL}/teamGames`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
}

export function getAllTeamsAcceptedInfos(eventId: string): Promise<AllTeamsAcceptedInfos[]> {
  return api(formatRoute(`${BASE_URL}/allTeamsAcceptedInfos`, null, { eventId }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export function getEvent(id: string): Promise<EventInfos> {
  return api(formatRoute(`${BASE_URL}/eventInfos`, null, { id }), { method: 'GET' }).then((res) => res.data);
}

export function getOptions(eventId: string): Promise<Options[]> {
  return api(formatRoute(`${BASE_URL}/options`, null, { eventId }), { method: 'GET' }).then((res) => res.data);
}

export function getRemainingSpots(id: string): Promise<number> {
  return api(formatRoute(`${BASE_URL}/remainingSpots`, null, { id }), { method: 'GET' }).then((res) => res.data);
}
