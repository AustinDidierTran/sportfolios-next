import { haveDifferentPhase } from './AddGame.utils';

describe('haveDifferentPhase', () => {
  const ranking1: { currentPhase: string } = { currentPhase: '123' };
  const ranking2: { currentPhase: string } = { currentPhase: '123' };
  const phase1 = '123';
  const ranking3: { currentPhase: string } = { currentPhase: '456' };
  const ranking4: { currentPhase: string } = { currentPhase: '456' };
  const phase2 = '456';

  it('should return', async () => {
    expect(haveDifferentPhase(ranking1, ranking2, phase1)).toBe(false);
    expect(haveDifferentPhase(ranking1, ranking2, phase2)).toBe(true);
    expect(haveDifferentPhase(ranking3, ranking4, phase2)).toBe(false);
    expect(haveDifferentPhase(ranking1, ranking3, phase1)).toBe(true);
  });
});
