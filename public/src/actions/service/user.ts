import { formatRoute } from '../../utils/stringFormats';
import api from '../api';
import { Person } from '../../../../typescript/types';
import { GLOBAL_ENUM } from '../../../common/enums';

const BASE_URL = '/api/user';

export async function getOwnedPerson(): Promise<Person[]> {
  return api(formatRoute(`${BASE_URL}/ownedPersons`, null, { type: GLOBAL_ENUM.PERSON }), { method: 'GET' }).then(
    (res) => res.data
  );
}

export async function addEmail(id: string, email: string): Promise<any> {
  return api(`${BASE_URL}/addEmail`, {
    method: 'POST',
    body: JSON.stringify({
      id,
      email,
    }),
  });
}
