import { useMemo } from 'react';
import { Role } from '../../../typescript/types';
import { ENTITIES_ROLE_ENUM } from '../Store';

export function useEditor(role: Role): boolean {
  const isEditor = useMemo<boolean>(() => [ENTITIES_ROLE_ENUM.ADMIN, ENTITIES_ROLE_ENUM.EDITOR].includes(role), [role]);
  return isEditor;
}

export function useAdmin(role: Role): boolean {
  const isAdmin = useMemo<boolean>(() => ENTITIES_ROLE_ENUM.ADMIN === role, [role]);
  return isAdmin;
}
