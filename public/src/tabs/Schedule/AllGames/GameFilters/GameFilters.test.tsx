import { formatFilter } from './GameFilters.utils';

interface IFilterSelect {
  value: string;
  display: string;
}

describe('handleChange', () => {
  const displayAllText = 'all inputs';
  const team1 = 'team1';
  const team1Id = '12345';
  const team2 = 'team2';
  const team2Id = '23456';
  const allValue = 'all';
  const filterTwoAllInput: IFilterSelect[] = [{ value: allValue, display: displayAllText }, { value: allValue, display: displayAllText }];
  const filter2InputAndAddAllInput: IFilterSelect[] = [{ value: team1Id, display: team1 }, { value: team2Id, display: team2 }, { value: allValue, display: displayAllText }];
  const filterAllInput: IFilterSelect[] = [{ value: allValue, display: displayAllText }];
  const filter1Input: IFilterSelect[] = [{ value: team1Id, display: team1 }];
  const filterAllInputAndAdd1Input: IFilterSelect[] = [
    { value: allValue, display: displayAllText },
    { value: team1Id, display: team1 },
  ];

  it('should return all display', async () => {
    expect(formatFilter(filterAllInput, displayAllText)).toStrictEqual(filterAllInput);
    expect(formatFilter(filterTwoAllInput, displayAllText)).toStrictEqual(filterAllInput);
    expect(formatFilter(filter2InputAndAddAllInput, displayAllText)).toStrictEqual(filterAllInput);
    expect(formatFilter([], displayAllText)).toStrictEqual(filterAllInput);
  });

  it('should return no all display', async () => {
    expect(formatFilter(filter1Input, displayAllText)).toStrictEqual(filter1Input);
    expect(formatFilter(filterAllInputAndAdd1Input, displayAllText)).toStrictEqual(filter1Input);
  });
});
