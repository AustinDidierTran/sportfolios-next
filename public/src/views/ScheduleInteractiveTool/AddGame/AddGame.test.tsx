import { haveDifferentPhase } from './AddGame.utils';

describe('haveDifferentPhase', () => {
  const ranking1CurrentPhaseId = '123';
  const ranking2CurrentPhaseId = '123';
  const phase1 = '123';
  const ranking3CurrentPhaseId = '456';
  const ranking4CurrentPhaseId = '456';
  const phase2 = '456';

  it('should return', async () => {
    expect(haveDifferentPhase(ranking1CurrentPhaseId, ranking2CurrentPhaseId, phase1)).toBe(false);
    expect(haveDifferentPhase(ranking1CurrentPhaseId, ranking2CurrentPhaseId, phase2)).toBe(true);
    expect(haveDifferentPhase(ranking3CurrentPhaseId, ranking4CurrentPhaseId, phase2)).toBe(false);
    expect(haveDifferentPhase(ranking1CurrentPhaseId, ranking3CurrentPhaseId, phase1)).toBe(true);
  });
});
