import { GLOBAL_ENUM } from '../../common/enums';
import { getEntityOwned } from '../actions/service/entity/get';

export const useOwnedPeopleIds = (): Promise<string[]> => {
  return getEntityOwned(GLOBAL_ENUM.PERSON).then((res) => res.map((p) => p.id));
};
