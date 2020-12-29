import ReactGa from "react-ga";
import { GOOGLE_ANALYTICS_TRACKING_ID } from "../../../../../conf";

const TRACKING_ID = GOOGLE_ANALYTICS_TRACKING_ID;

export const InitGa = () => {
  ReactGa.initialize(TRACKING_ID);
};

export const AddGaPageView = async () => {
  const activePageviews = JSON.parse(localStorage.getItem("activeGaPageviews"));

  if (
    activePageviews &&
    activePageviews.some((pv) => pv.pathname === window.location.pathname)
  ) {
    ReactGa.pageview(window.location.pathname);
  }
};

/**
 * Event - Add custom tracking event.
 * @param {string} args
 * category and action are required,
 */
export const AddGaEvent = async ({ category, action, label }) => {
  const activeEvents = JSON.parse(localStorage.getItem("activeGaEvents"));
  if (category === undefined || action === undefined) {
    throw new Error("category and action are required");
  }

  if (activeEvents && activeEvents.some((e) => e.category === category)) {
    ReactGa.event({ category, action, label });
  }
};
