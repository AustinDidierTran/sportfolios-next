import { useMemo } from 'react';
import { ENTITIES_ROLE_ENUM } from '../../common/enums';

export function useEditor(role: ENTITIES_ROLE_ENUM): boolean {
  const isEditor = useMemo<boolean>(() => [ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(role), [role]);
  return isEditor;
}

export function useAdmin(role: ENTITIES_ROLE_ENUM): boolean {
  const isAdmin = useMemo<boolean>(() => ENTITIES_ROLE_ENUM.ADMIN === role, [role]);
  return isAdmin;
}
