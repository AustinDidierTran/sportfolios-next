export function haveDifferentPhase(
  ranking1CurrentPhaseId: string,
  ranking2CurrentPhaseId: string,
  phase: string
): boolean {
  return (
    ranking1CurrentPhaseId !== ranking2CurrentPhaseId ||
    phase !== ranking1CurrentPhaseId ||
    phase !== ranking2CurrentPhaseId
  );
}
