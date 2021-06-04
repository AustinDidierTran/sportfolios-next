import { MEMBERSHIP_LENGTH_ENUM, MEMBERSHIP_TYPE_ENUM, GLOBAL_ENUM } from '../../../common/enums';
import isArray from 'lodash/isArray';

import moment from 'moment';
import 'moment/locale/fr';
import i18n from '../../i18n';

export const getInitialsFromName = (completeName, isName) => {
  if (!completeName) {
    return '';
  }

  if (isName !== undefined && isName !== true && typeof completeName === 'string') {
    const str = completeName.trim().split(' ');
    let res = `${str[0]}${str[3] ? str[3].charAt(0) : str[2].charAt(0)}`.toUpperCase();
    return res;
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

export const fillWithZeros = (number, zeros = 0) => {
  if (!zeros) {
    return number;
  }
  const parsedNumber = Number(number);

  const numberOfDigits = parsedNumber === 0 ? 1 : Math.floor(Math.log(parsedNumber) / Math.log(10)) + 1;

  const zerosToAdd = zeros - numberOfDigits;

  const zerosArray = Array(zerosToAdd).fill(0);

  return zerosArray.reduce((prev) => `0${prev}`, `${parsedNumber}`);
};

export const formatRoute = (route, params, queryParams) => {
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

  return Object.keys(queryParams).reduce(
    (prev, key, index) => (index === 0 ? `${prev}?${key}=${queryParams[key]}` : `${prev}&${key}=${queryParams[key]}`),
    withParams
  );
};

export const formatDate = (moment, format = 'LL') => {
  if (!moment.isValid()) {
    return null;
  }
  if (typeof window != 'undefined') {
    const language = (localStorage && localStorage.getItem('i18nextLng')) || 'fr';
    moment.locale(language);
    if (format === 'MMM D' && language === 'fr') {
      return moment.format('D MMM');
    }
  }
  return moment.format(format);
};

export const formatIntervalDate = (start, end) => {
  let word = 'to';
  if (typeof window != 'undefined') {
    if (localStorage.getItem('i18nextLng') === 'fr') {
      word = 'au';
    }
  }

  if (!start.isValid() || !end.isValid() || !start || !end) {
    return '';
  }

  if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
    return formatDate(start);
  }

  if (start.year() != end.year()) {
    return `${formatDate(start)} ${word} ${formatDate(end)} `;
  }
  if (start.month() != end.month()) {
    return `${formatDate(start).split(' ')[0]} ${formatDate(start).split(' ')[1]} ${word} ${formatDate(end)} `;
  }
  return `${formatDate(start).split(' ')[0]} ${formatDate(start).split(' ')[1]} ${word} ${formatDate(end)} `;
};

export const getEntityTypeName = (type) => {
  if (type === GLOBAL_ENUM.PERSON) {
    return 'person.person';
  } else if (type === GLOBAL_ENUM.TEAM) {
    return 'team.team';
  } else if (type === GLOBAL_ENUM.ORGANIZATION) {
    return 'organization';
  } else if (type === GLOBAL_ENUM.EVENT) {
    return 'event.event';
  } else {
    return '';
  }
};

export const formatPageTitle = (title) => {
  if (title) {
    return `${title} | Sportfolios`;
  }
  return 'Sportfolios';
};

export const getMembershipName = (type) => {
  if (type === MEMBERSHIP_TYPE_ENUM.RECREATIONAL) {
    return 'recreational_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.COMPETITIVE) {
    return 'competitive_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.ELITE) {
    return 'elite_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.JUNIOR) {
    return 'junior_member';
  } else {
    return '';
  }
};

export const getMembershipType = (length, date) => {
  if (length) {
    if (length === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
      return 'yearly';
    }
    if (length === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
      return 'biannual';
    }
    if (length === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
      return 'monthly';
    }
  } else if (date) {
    return 'fixed_date';
  } else {
    return null;
  }
};

export const getMembershipLength = (type) => {
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

export const getMembershipUnit = (type) => {
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

export const getExpirationDate = (length, date) => {
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

export const formatPrice = (price) => {
  if (!price) {
    return '0.00$';
  }
  return `${(price / 100).toFixed(2)}$`;
};

export const validateDate = (dateProps) => {
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
export const validateDateWithYear = (dateProps) => {
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

export const getFormattedMailTo = (emails, subject, body) => {
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

  const queryParams = {};

  if (subject) {
    queryParams.subject = encodeURIComponent(subject);
  }

  if (body) {
    queryParams.body = encodeURIComponent(body);
  }

  return formatRoute(`mailTo:${formattedEmails}`, null, queryParams);
};

export const validateEmail = (email) => {
  return email && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};

export function timestampToRelativeTime(timeStamp) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = new Date() - timeStamp;
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
