import { getFormattedMailTo } from '../../utils/stringFormats';
import { ROUTES_ENUM } from '../../../common/enums';
import { formatRoute } from '../../../common/utils/stringFormat';
import Router from 'next/router';
import api from '../api';

export const ROUTES = ROUTES_ENUM;

export const goTo = (route, params, queryParams) => {
  if (route === ROUTES.entity) {
    const { id } = params;
    goToAlias(id, params, queryParams);
    return;
  }

  Router.push(formatRoute(route, params, queryParams));
};

export const goToScrollTo = (route, params, queryParams, scrollTo) => {
  Router.push(formatRoute(route, params, queryParams) + `#${scrollTo}`);
};

export const goToLink = (route) => {
  Router.push(route);
};

export const goToAlias = async (entityId, params, queryParams) => {
  const { data } = await api(
    formatRoute('/api/entity/alias', null, {
      entityId,
    })
  );

  if (!data) {
    Router.push(ROUTES.entityNotFound);
  }

  const entity = data.alias || data.entityId;

  const allParams = { id: entity, ...params };
  const route = formatRoute(ROUTES.entity, allParams, queryParams);

  Router.push(route);
};

export const goToAndReplace = (route, params, queryParams) => {
  Router.replace(formatRoute(route, params, queryParams));
};

export const goBack = () => {
  Router.back();
};

export const mailTo = (emailsFormatted, subject, message) => {
  document.location.href = getFormattedMailTo(emailsFormatted, subject, message);
};
