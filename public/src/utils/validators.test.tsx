/* eslint-disable no-undef */
import { ROSTER_ROLE_ENUM } from '../../common/enums';
import { hasXDigits, remainsOneCaptainOrCoach } from './validators';

describe('ValidateHasXDigits', () => {
  const number1 = 1;
  const number2 = 2;
  const number3 = 3;
  const number5 = 5;
  const number10 = 10;
  const number19 = 19;
  const number101 = 101;
  const number12345 = 12345;

  it('should return true when correct format', () => {
    expect(hasXDigits(number1, number1)).toBe(true);
    expect(hasXDigits(number2, number1)).toBe(true);
    expect(hasXDigits(number10, number2)).toBe(true);
    expect(hasXDigits(number19, number2)).toBe(true);
    expect(hasXDigits(number101, number3)).toBe(true);
    expect(hasXDigits(number12345, number5)).toBe(true);
  });

  it('should return false when wrong format', () => {
    expect(hasXDigits(number1, number2)).toBe(false);
    expect(hasXDigits(number2, number2)).toBe(false);
    expect(hasXDigits(number2, number3)).toBe(false);
    expect(hasXDigits(number101, number1)).toBe(false);
    expect(hasXDigits(number101, number2)).toBe(false);
    expect(hasXDigits(number3, number101)).toBe(false);
    expect(hasXDigits(number12345, number3)).toBe(false);
  });
});

describe('ValidateRemainOneCaptainOrCoach', () => {
  const emptyPlayerList: any[] = [];
  const playerListNoCaptain = [{id: '1',role: ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}, {id: '2',role: ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}];
  const playerListWithCaptainId1 = [{id: '1',role: ROSTER_ROLE_ENUM.CAPTAIN}, {id: '2',role: ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}];
  const playerListWithCoachId1 = [{id: '1',role: ROSTER_ROLE_ENUM.COACH}, {id: '2',role: ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}];
  const playerListWithCaptainAndCoach = [{id: '1',role: ROSTER_ROLE_ENUM.CAPTAIN}, {id: '2',role: ROSTER_ROLE_ENUM.COACH}];
  const playerId1 = '1';
  const playerId2 = '2';

  it('should return true when there is a coach or captain different than id', () => {
    expect(remainsOneCaptainOrCoach(playerListWithCaptainId1, playerId2)).toBe(true);
    expect(remainsOneCaptainOrCoach(playerListWithCoachId1, playerId2)).toBe(true);
    expect(remainsOneCaptainOrCoach(playerListWithCaptainAndCoach, playerId1)).toBe(true);
    expect(remainsOneCaptainOrCoach(playerListWithCaptainAndCoach, playerId2)).toBe(true);
  });

  it('should return false when no coach or captain different than id', () => {
    expect(remainsOneCaptainOrCoach(playerListNoCaptain, playerId1)).toBe(false);
    expect(remainsOneCaptainOrCoach(playerListWithCaptainId1, playerId1)).toBe(false);
    expect(remainsOneCaptainOrCoach(playerListWithCoachId1, playerId1)).toBe(false);
    expect(remainsOneCaptainOrCoach(emptyPlayerList, playerId1)).toBe(false);
  });
});

