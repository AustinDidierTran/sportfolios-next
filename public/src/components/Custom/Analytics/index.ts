import ReactGa from 'react-ga';
import { GOOGLE_ANALYTICS_TRACKING_ID } from '../../../../../conf';

const TRACKING_ID = GOOGLE_ANALYTICS_TRACKING_ID;

export const InitGa = (): void => {
  ReactGa.initialize(TRACKING_ID);
};

export const AddGaPageView = async (): Promise<void> => {
  const activePageviews = JSON.parse(localStorage.getItem('activeGaPageviews'));

  if (activePageviews && activePageviews.some((pv: any) => pv.pathname === window.location.pathname)) {
    ReactGa.pageview(window.location.pathname);
  }
};

/**
 * Event - Add custom tracking event.
 * @param {string} args
 * category and action are required,
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const AddGaEvent = async ({ category, action, label }: any): Promise<void> => {
  const activeEvents = JSON.parse(localStorage.getItem('activeGaEvents'));
  if (category === undefined || action === undefined) {
    throw new Error('category and action are required');
  }

  if (activeEvents && activeEvents.some((e: any) => e.category === category)) {
    ReactGa.event({ category, action, label });
  }
};
