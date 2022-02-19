import { useMemo } from 'react';
import { formatRoute } from '../utils/stringFormats';

export const useRedirectUrl = (route: string, redirectUrl: string): string => {
  const formattedRoute = useMemo(
    () => (redirectUrl ? formatRoute(route, null, { redirectUrl: encodeURI(redirectUrl) }) : route),
    [route, redirectUrl]
  );

  return formattedRoute;
};
