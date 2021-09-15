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
} from '../../../../../typescript/types';
import { ENTITIES_ROLE_ENUM, ROSTER_ROLE_ENUM } from '../../../../common/enums';

const BASE_URL = '/api/event';

export function getAllPeopleRegisteredNotInTeamsInfos(eventId: string): Promise<Person[]> {
  return api(formatRoute(`${BASE_URL}/getAllPeopleRegisteredNotInTeamsInfos`, null, { eventId }), {
    method: 'GET',
  }).then((res) => res.data);
}
