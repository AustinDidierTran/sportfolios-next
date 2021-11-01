import {
  MEMBERSHIP_LENGTH_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  GLOBAL_ENUM,
  ROSTER_ROLE_ENUM,
  INVOICE_STATUS_ENUM,
} from '../../../common/enums';
import isArray from 'lodash/isArray';
import moment from 'moment';
import 'moment/locale/fr';
import { i18n } from '../../i18n';

export const getInitialsFromName = (completeName: string | { name: string; surname: string }): string => {
  if (!completeName) {
    return '';
  }

  if (typeof completeName === 'string') {
    return (
      completeName &&
      completeName
        .trim()
        .split(/(?:-| )+/)
        .reduce((prev, curr, index) => (index <= 2 ? `${prev}${curr[0]}` : prev), '')
        .toUpperCase()
    );
  }
  return `${completeName?.name ? completeName?.name[0] : ''}${completeName?.surname ? completeName?.surname[0] : ''}`;
};

export const getIconFromRole = (role: string): string => {
  switch (role) {
    case ROSTER_ROLE_ENUM.COACH:
      return 'SportsWhistle';
    case ROSTER_ROLE_ENUM.CAPTAIN:
      return 'Stars';
    case ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN:
      return 'TextFormat';
    default:
      return 'Person';
  }
};

export const formatRoute = (route: string, params: any, queryParams: any): string => {
  if (!route) {
    /* eslint-disable-next-line */
    console.error('Route is undefined');
  }

  if (!params && !queryParams) {
    return route;
  }

  const withParams = params
    ? Object.keys(params).reduce((prev, curr) => prev.replace(`:${curr}`, params[curr]), route)
    : route;

  if (!queryParams) {
    return withParams;
  }

  return Object.keys(queryParams)
    .filter((q) => q)
    .reduce(
      (prev, key, index) =>
        !queryParams[key]
          ? prev
          : index === 0
          ? `${prev}?${key}=${queryParams[key]}`
          : `${prev}&${key}=${queryParams[key]}`,
      withParams
    );
};

export const formatDate = (date: any, format = 'LL'): string => {
  if (!date.isValid()) {
    return '';
  }
  if (typeof window != 'undefined') {
    const language = (localStorage && localStorage.getItem('i18nextLng')) || 'fr';
    date.locale(language);
    if (format === 'MMM D' && language === 'fr') {
      return moment.utc(date).format('D MMM');
    }
  }
  return moment.utc(date).format(format);
};

export const formatIntervalDate = (start: any, end: any): string | null => {
  let word = 'to';
  let split = true;
  if (typeof window != 'undefined') {
    if (localStorage.getItem('i18nextLng') === 'fr') {
      word = 'au';
      split = false;
    }
  }

  if (!start || !end || !start.isValid() || !end.isValid()) {
    return '';
  }

  if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
    return formatDate(start);
  }

  if (start.year() != end.year()) {
    return `${formatDate(start)} ${word} ${formatDate(end)} `;
  }

  return `${formatDate(start)?.split(' ')[0]} ${
    split ? formatDate(start)?.split(' ')[1].slice(0, -1) : formatDate(start)?.split(' ')[1]
  } ${word} ${formatDate(end)} `;
};

export const getEntityTypeName = (type: number): string => {
  if (type === GLOBAL_ENUM.PERSON) {
    return i18n.t('person.person');
  } else if (type === GLOBAL_ENUM.TEAM) {
    return i18n.t('team.team');
  } else if (type === GLOBAL_ENUM.ORGANIZATION) {
    return i18n.t('organization');
  } else if (type === GLOBAL_ENUM.EVENT) {
    return i18n.t('event.event');
  } else {
    return '';
  }
};

export const formatPageTitle = (title?: string): string => {
  if (title) {
    return `${title} | Sportfolios`;
  }
  return 'Sportfolios';
};

export const getMembershipName = (type: number): string => {
  if (type === MEMBERSHIP_TYPE_ENUM.RECREATIONAL) {
    return i18n.t('recreational_member');
  } else if (type === MEMBERSHIP_TYPE_ENUM.COMPETITIVE) {
    return i18n.t('competitive_member');
  } else if (type === MEMBERSHIP_TYPE_ENUM.ELITE) {
    return i18n.t('elite_member');
  } else if (type === MEMBERSHIP_TYPE_ENUM.JUNIOR) {
    return i18n.t('junior_member');
  } else {
    return '';
  }
};
export const getPaymentStatusName = (status: string): string => {
  switch (status) {
    case INVOICE_STATUS_ENUM.OPEN:
      return i18n.t('payment.not_paid');
    case INVOICE_STATUS_ENUM.PAID:
      return i18n.t('payment.paid');
    case INVOICE_STATUS_ENUM.FREE:
      return i18n.t('free');
    case INVOICE_STATUS_ENUM.REFUNDED:
      return i18n.t('refunded');
    default:
      return '';
  }
};

export const getMembershipType = (length?: number, date?: string): string | undefined => {
  if (length) {
    if (length === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
      return i18n.t('yearly');
    }
    if (length === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
      return i18n.t('biannual');
    }
    if (length === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
      return i18n.t('monthly');
    }
    return '';
  } else if (date) {
    return i18n.t('fixed_date');
  } else {
    return '';
  }
};

export const getMembershipLength = (type: number): number | undefined => {
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
    return 1;
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
    return 6;
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
    return 1;
  }
};

export const getMembershipUnit = (type: number): moment.unitOfTime.DurationConstructor | undefined => {
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
    return 'M';
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
    return 'M';
  }
  if (type === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
    return 'y';
  }
};

export const getExpirationDate = (length?: number, date?: string): string | null => {
  if (length) {
    return formatDate(moment.utc().add(getMembershipLength(length), getMembershipUnit(length)));
  } else if (date) {
    if (moment(new Date(date)).set('year', moment().get('year')) < moment()) {
      return formatDate(moment.utc(new Date(date)).set('year', moment().get('year') + 1));
    } else {
      return formatDate(moment.utc(new Date(date)).set('year', moment().get('year')));
    }
  } else {
    return null;
  }
};

export const formatPrice = (price?: number): string => {
  if (!price) {
    return '0.00$';
  }
  return `${(price / 100).toFixed(2)}$`;
};

export const validateDate = (dateProps: string): boolean => {
  //date format: 'MM/DD'
  const days = [31, 28, 31, 30, 31, 30, 31, 30, 31, 31, 30, 31];
  const date = dateProps.split('/');
  const month = Number(date[0]);
  const day = Number(date[1]);
  if (month < 1 || month > 12 || isNaN(month) || month === null) {
    return false;
  } else if (day > days[month - 1] || day < 1 || isNaN(day) || day === null) {
    return false;
  }
  return true;
};
export const validateDateWithYear = (dateProps: string): boolean => {
  //date format: 'DD/MM/YYYY'
  const days = [31, 28, 31, 30, 31, 30, 31, 30, 31, 31, 30, 31];
  const date = dateProps.split('/');
  const day = Number(date[0]);
  const month = Number(date[1]);
  const year = Number(date[2]);
  if (month < 1 || month > 12 || isNaN(month) || month === null) {
    return false;
  }
  if (day > days[month - 1] || day < 1 || isNaN(day) || day === null) {
    return false;
  }
  if (isNaN(year) || year === null) {
    return false;
  }
  return true;
};

export const getFormattedMailTo = (emails?: string, subject?: string, body?: string): string => {
  if (!emails) {
    throw 'No email is provided';
  }

  if (!isArray(emails)) {
    throw 'Emails should be an array';
  }

  if (!emails.length) {
    throw 'No email is provided';
  }

  const formattedEmails = emails.join(', ');

  const queryParams: any = {};

  if (subject) {
    queryParams.subject = encodeURIComponent(subject);
  }

  if (body) {
    queryParams.body = encodeURIComponent(body);
  }

  return formatRoute(`mailTo:${formattedEmails}`, null, queryParams);
};

export const validateEmail = (email: string): boolean => {
  return (email ? true : false) && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export function timestampToRelativeTime(timeStamp: any): string {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const today: any = new Date();
  const elapsed = today - timeStamp;
  if (elapsed < msPerMinute) {
    return i18n.t('second_ago', {
      count: Math.round(elapsed / 1000),
    });
  } else if (elapsed < msPerHour) {
    return i18n.t('minute_ago', {
      count: Math.round(elapsed / msPerMinute),
    });
  } else if (elapsed < msPerDay) {
    return i18n.t('hour_ago', {
      count: Math.round(elapsed / msPerHour),
    });
  } else if (elapsed < msPerMonth) {
    return i18n.t('day_ago', {
      count: Math.round(elapsed / msPerDay),
    });
  } else if (elapsed < msPerYear) {
    return i18n.t('month_ago', {
      count: Math.round(elapsed / msPerMonth),
    });
  } else {
    return i18n.t('year_ago', {
      count: Math.round(elapsed / msPerYear),
    });
  }
}

export function getTimeToShow(date: string): string {
  const newDate: any = new Date(date);
  const today: any = new Date();
  const deltaTime = Math.floor(Math.abs(today - newDate) / 1000 / 86400);
  if (deltaTime < 1) {
    return moment.utc(newDate).fromNow();
  } else if (deltaTime > 1 && deltaTime < moment.utc(newDate).daysInMonth()) {
    return moment.utc(newDate).format('DD MMMM, HH:mm');
  } else if (deltaTime == 1) {
    return i18n.t('yesterday_at', { date_time: moment.utc(newDate).format('HH:mm') });
  } else {
    return moment.utc(newDate).format('DD MMMM YYYY');
  }
}
