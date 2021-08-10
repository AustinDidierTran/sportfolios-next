import {
  ROSTER_ROLE_ENUM,
} from '../../common/enums';

export const hasXDigits = (number: number, numberOfDigits: number): boolean => {
  return number >= Math.pow(10, (numberOfDigits - 1)) && number < Math.pow(10, numberOfDigits);
};

export const remainsOneCaptainOrCoach = (players: any[], teamPlayerId: string): boolean => {
  return players.some(
    (p) => p.id !== teamPlayerId && (p.role === ROSTER_ROLE_ENUM.CAPTAIN || p.role === ROSTER_ROLE_ENUM.COACH)
  );
}