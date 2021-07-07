export function haveDifferentPhase(
  ranking1: { currentPhase: string },
  ranking2: { currentPhase: string },
  phase: string
) {
  return (
    ranking1.currentPhase !== ranking2.currentPhase ||
    phase !== ranking1.currentPhase ||
    phase !== ranking2.currentPhase
  );
}
