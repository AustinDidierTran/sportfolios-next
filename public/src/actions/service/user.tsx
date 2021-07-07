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

  //Permet de mettre la primary person comme 1er élément de la liste
  for (let i = 0; i < data.length; i++) {
    if (data[i].isPrimaryPerson) {
      data.unshift(data.splice(i, 1)[0]);
      break;
    }
  }
  return data;
}
