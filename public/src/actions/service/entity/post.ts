import api from '../../api';

import { Member, Person, Player } from '../../../../../typescript/types';
import { EXERCISES_TYPE_ENUM, USER_APP_ROLE_ENUM } from '../../../../common/enums';

const BASE_URL = '/api/entity';

export function addRoster(
  teamId: string,
  // eslint-disable-next-line no-undef
  players: Pick<Person, 'id' | 'completeName' | 'photoUrl'>[],
  name: string
): Promise<number> {
  return api(`${BASE_URL}/roster`, { method: 'POST', body: JSON.stringify({ teamId, players, name }) }).then(
    (res) => res.status
  );
}

export function addEntity(
  name: string,
  surname: string,
  type: string,
  creator: string,
  maximumSpots: string,
  startDate: string,
  endDate: string,
  eventType: string,
  photoUrl: string
): Promise<{ id: string; status: number }> {
  return api(BASE_URL, {
    method: 'POST',
    body: JSON.stringify({ name, surname, type, creator, maximumSpots, startDate, endDate, eventType, photoUrl }),
  }).then((res) => {
    return { id: res.data.id, status: res.status };
  });
}

export function addExercise(
  exerciseId: string,
  name: string,
  description: string,
  practiceId: string,
  teamId: string,
  type: EXERCISES_TYPE_ENUM
): Promise<number> {
  return api(`${BASE_URL}/exercise`, {
    method: 'POST',
    body: JSON.stringify({ exerciseId, name, description, type, sessionId: practiceId, teamId }),
  }).then((res) => res.status);
}

export function addPhase(phase: string, spots: number, eventId: string, type: string): Promise<number> {
  return api(`${BASE_URL}/phase`, { method: 'POST', body: JSON.stringify({ phase, spots, eventId, type }) }).then(
    (res) => res.status
  );
}

export function addMemberWithCoupon(body: {
  membershipId: string;
  membershipType: string;
  organizationId: string;
  termsAndConditionsId: string;
  personId: string;
  expirationDate: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  address: string;
  emergencyName: string;
  emergencySurname: string;
  emergencyPhoneNumber: string;
  medicalConditions: string;
  tokenId: string;
}): Promise<Member> {
  return api(`${BASE_URL}/memberWithCoupon`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function addMember(body: {
  membershipId: string;
  membershipType: string;
  organizationId: string;
  personId: string;
  expirationDate: string;
  birthDate: string;
  gender: string;
  phoneNumber: string;
  address: string;
  emergencyName: string;
  emergencySurname: string;
  emergencyPhoneNumber: string;
  medicalConditions: string;
}): Promise<Member> {
  return api(`${BASE_URL}/member`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function addPlayers(teamId: string, players: Player[]): Promise<number> {
  return api(`${BASE_URL}/players`, { method: 'POST', body: JSON.stringify({ teamId, players }) }).then(
    (res) => res.status
  );
}

export function confirmEmail(token: string): Promise<any> {
  return api('/api/auth/confirmEmail', {
    method: 'POST',
    body: JSON.stringify({
      token,
    }),
  });
}

export function unregisterPeople({ eventId, people }: { eventId: string; people: any }): Promise<any> {
  return api(`${BASE_URL}/unregisterPeople`, { method: 'POST', body: JSON.stringify({ eventId, people }) });
}

export function unregisterTeams({ eventId, rosterIds }: { eventId: string; rosterIds: any }): Promise<any> {
  return api(`${BASE_URL}/unregisterTeams`, { method: 'POST', body: JSON.stringify({ eventId, rosterIds }) });
}

export function addRole(entityIdAdmin: string, role: number, entityId: string): Promise<any> {
  return api(`${BASE_URL}/role`, {
    method: 'POST',
    body: JSON.stringify({ entity_id_admin: entityIdAdmin, role, entity_id: entityId }),
  });
}

export function sendRequestToJoinTeam(teamId: string, personId: string): Promise<number> {
  return api(`${BASE_URL}/joinTeam`, { method: 'POST', body: JSON.stringify({ teamId, personId }) }).then(
    (res) => res.status
  );
}

export function updateUserRole(userId: string, role: USER_APP_ROLE_ENUM): Promise<void> {
  return api('/api/admin/updateUserRole', {
    method: 'POST',
    body: JSON.stringify({
      userId,
      role,
    }),
  });
}
