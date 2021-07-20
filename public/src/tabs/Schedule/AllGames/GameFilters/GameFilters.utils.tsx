import { SELECT_ENUM } from '../../../../../common/enums';

interface IFilterSelect {
  value: string;
  display: string;
}

export function formatFilter(filterSelect: IFilterSelect[], displayAll: string): IFilterSelect[] {
  if (filterSelect.length == 0 || filterSelect[filterSelect.length - 1].value == 'all') {
    return [{ value: SELECT_ENUM.ALL, display: displayAll }];
  } else {
    return filterSelect.filter((f) => f.value != 'all');
  }
}
