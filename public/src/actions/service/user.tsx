import { formatRoute } from '../../utils/stringFormats';
import api from '../api';
import { Person } from '../../../../typescript/types';
import { GLOBAL_ENUM } from '../../../common/enums';

const BASE_URL = '/api/user';

export async function getOwnedPerson(): Promise<Person[]> {
  const { data } = await api(
    formatRoute(`${BASE_URL}/ownedPersons`, null, {
      type: GLOBAL_ENUM.PERSON,
    })
  );

  data.sort((a: { isPrimaryPerson: boolean }, b: { isPrimaryPerson: boolean }) =>
    a.isPrimaryPerson ? -1 : b.isPrimaryPerson ? 1 : 0
  );

  return data;
}
