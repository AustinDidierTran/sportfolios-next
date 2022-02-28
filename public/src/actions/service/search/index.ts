import api from '../../api';
import { formatRoute } from '../../../utils/stringFormats';
import { EntityType } from '../../../../../typescript/entity';
import { ERROR_ENUM } from '../../../../common/errors';
import { SearchResult } from '../../../views/v2/Search';

const BASE_URL = '/api/search';

export const getGlobalSearch = async (query: string, type: EntityType): Promise<SearchResult[]> => {
  if (!query) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  return api(formatRoute(`${BASE_URL}/global`, null, { query, type }), { method: 'GET' }).then(
    (res) => res.data.entities
  );
};
