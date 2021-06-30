/* eslint-disable no-undef */
import {
  getInitialsFromName,
  getIconFromRole,
  formatRoute,
  formatDate,
  formatIntervalDate,
  getEntityTypeName,
  formatPageTitle,
  getMembershipName,
  getMembershipType,
  getMembershipLength,
  getMembershipUnit,
  getExpirationDate,
  formatPrice,
  validateDate,
  validateDateWithYear,
  getFormattedMailTo,
  validateEmail,
  timestampToRelativeTime,
  getTimeToShow,
} from './index';
import { MEMBERSHIP_LENGTH_ENUM, MEMBERSHIP_TYPE_ENUM, GLOBAL_ENUM, ROSTER_ROLE_ENUM } from '../../../common/enums';
import moment from 'moment';

var localStorageMock = (function () {
  var store: any = {};
  return {
    getItem: function (key: any) {
      return store[key];
    },
    setItem: function (key: any, value: any) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
    removeItem: function (key: any) {
      delete store[key];
    },
  };
})();

Object.defineProperty(global, 'window', {
  value: {
    location: {
      search: 'test',
    },
  },
});

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('ValidateInitialsFromName', () => {
  const noName: string = '';
  const stringName: string = 'Paul Blart';
  const stringInitialFullName: string = 'PB';
  const stringInitialName: string = 'P';
  const stringInitialSurname: string = 'B';
  const objectFullName: any = { name: 'Paul', surname: 'Blart' };
  const objectName: any = { name: 'Paul' };
  const objectSurname: any = { surname: 'Blart' };

  it('should return nothing when empty name', async () => {
    expect(getInitialsFromName(noName)).toBe(noName);
    expect(getInitialsFromName(noName)).toBe(noName);
  });

  it('should return string initial name when name is string', async () => {
    expect(getInitialsFromName(stringName)).toBe(stringInitialFullName);
  });

  it('should return string inital name when name is object', async () => {
    expect(getInitialsFromName(objectFullName)).toBe(stringInitialFullName);
    expect(getInitialsFromName(objectFullName)).toBe(stringInitialFullName);
    expect(getInitialsFromName(objectName)).toBe(stringInitialName);
    expect(getInitialsFromName(objectName)).toBe(stringInitialName);
    expect(getInitialsFromName(objectSurname)).toBe(stringInitialSurname);
    expect(getInitialsFromName(objectSurname)).toBe(stringInitialSurname);
  });
});

describe('ValidateIconsFromRole', () => {
  const coachIcon: string = 'SportsWhistle';
  const captainIcon: string = 'Stars';
  const assistantCaptainIcon: string = 'TextFormat';
  const defaultIcon: string = 'Person';
  const randomRole: string = '123 day';
  const emptyRole: string = '';

  it('should return icon', async () => {
    expect(getIconFromRole(ROSTER_ROLE_ENUM.COACH)).toBe(coachIcon);
    expect(getIconFromRole(ROSTER_ROLE_ENUM.CAPTAIN)).toBe(captainIcon);
    expect(getIconFromRole(ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN)).toBe(assistantCaptainIcon);
    expect(getIconFromRole(randomRole)).toBe(defaultIcon);
    expect(getIconFromRole(emptyRole)).toBe(defaultIcon);
  });
});

describe('ValidateFormatRoute', () => {
  const route: string = '/test/api';
  const routeWithParam: string = '/test/api/:user';
  const params: any = { user: 'Paul' };
  const queryParams: any = { id: 33 };

  const routeWithParamResult: string = '/test/api/Paul';
  const routeWithQueryParams: string = '/test/api?id=33';
  const nullParams: any = null;
  const nullQueryParams: any = null;
  const noRoute: string = '';

  it('should return route', async () => {
    expect(formatRoute(route, nullParams, nullQueryParams)).toBe(route);
    expect(formatRoute(routeWithParam, params, nullQueryParams)).toBe(routeWithParamResult);
    expect(formatRoute(route, params, queryParams)).toBe(routeWithQueryParams);
  });

  it('should give a console.error', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    formatRoute(noRoute, params, queryParams);
    expect(consoleSpy).toHaveBeenCalled();
    formatRoute(noRoute, nullParams, nullQueryParams);
    expect(consoleSpy).toHaveBeenCalled();
  });
});

describe('ValidateFormatDate', () => {
  const nonValidDate: any = moment(new Date('20001-11-32'));
  const momentDate: any = moment(new Date('2000-01-01'));
  const momentLongDate: any = moment(new Date('2000-01-01T03:24:00'));
  const formatedFrDate: string = '1 janvier 2000';
  const formatedEnDate: string = 'January 1, 2000';
  const newFormat: string = 'MMM D';
  const format: string = 'D MMM';
  const newLanguageFrFormatedDate: string = '1 janv.';
  const newLanguageEnFormatedDate: string = 'Jan 1';
  const emptyDate: string = '';

  it('should return non valid date', async () => {
    expect(formatDate(nonValidDate)).toBe(emptyDate);
  });

  it('should return date', async () => {
    expect(formatDate(momentDate)).toBe(formatedFrDate);
    expect(formatDate(momentLongDate)).toBe(formatedFrDate);
    expect(formatDate(momentDate, format)).toBe(newLanguageFrFormatedDate);
    expect(formatDate(momentLongDate, format)).toBe(newLanguageFrFormatedDate);
  });

  it('should return date and window exist', async () => {
    expect(formatDate(momentLongDate, newFormat)).toBe(newLanguageFrFormatedDate);
    localStorageMock.setItem('i18nextLng', 'en');
    expect(formatDate(momentLongDate, newFormat)).toBe(newLanguageEnFormatedDate);
    expect(formatDate(momentLongDate)).toBe(formatedEnDate);
  });
});

describe('ValidateFormatIntervalDate', () => {
  const nonValidStartDate: any = moment(new Date('20001-11-32'));
  const nonValidEndDate: any = moment(new Date('20001-11-32'));
  const startDate: any = moment(new Date('2000-01-10'));
  const endDate: any = moment(new Date('2001-01-10'));
  const endOneYearDate: any = moment(new Date('2001-01-10'));
  const endOneDayMonthDate: any = moment(new Date('2000-02-11'));
  const formatedYearEnDate: string = 'January 10, 2000 to January 10, 2001 ';
  const formatedIntervalEnDate: string = 'January 10 to February 11, 2000 ';
  const formatedYearFrDate: string = '10 janvier 2000 au 10 janvier 2001 ';
  const formatedIntervalFrDate: string = '10 janvier au 11 février 2000 ';
  const formatedFrDate: string = '10 janvier 2000';
  const formatedEnDate: string = 'January 10, 2000';

  it('should return nothing', async () => {
    expect(formatIntervalDate(nonValidStartDate, endDate)).toBe('');
    expect(formatIntervalDate(startDate, nonValidEndDate)).toBe('');
    expect(formatIntervalDate(nonValidStartDate, nonValidEndDate)).toBe('');
    expect(formatIntervalDate(null, endDate)).toBe('');
    expect(formatIntervalDate(startDate, null)).toBe('');
    expect(formatIntervalDate(null, null)).toBe('');
  });

  it('should return interval in english', async () => {
    localStorageMock.setItem('i18nextLng', 'en');
    expect(formatIntervalDate(startDate, startDate)).toBe(formatedEnDate);
    expect(formatIntervalDate(startDate, endOneYearDate)).toBe(formatedYearEnDate);
    expect(formatIntervalDate(startDate, endOneDayMonthDate)).toBe(formatedIntervalEnDate);
  });

  it('should return interval in french', async () => {
    localStorageMock.setItem('i18nextLng', 'fr');
    expect(formatIntervalDate(startDate, startDate)).toBe(formatedFrDate);
    expect(formatIntervalDate(startDate, endOneYearDate)).toBe(formatedYearFrDate);
    expect(formatIntervalDate(startDate, endOneDayMonthDate)).toBe(formatedIntervalFrDate);
  });
});

describe('ValidateEntityName', () => {
  const personType: string = 'person.person';
  const teamType: string = 'team.team';
  const organizationType: string = 'organization';
  const eventType: string = 'event.event';
  const defaultType: string = '';
  const randomType: number = 123;

  it('should return name', async () => {
    expect(getEntityTypeName(GLOBAL_ENUM.PERSON)).toBe(personType);
    expect(getEntityTypeName(GLOBAL_ENUM.TEAM)).toBe(teamType);
    expect(getEntityTypeName(GLOBAL_ENUM.ORGANIZATION)).toBe(organizationType);
    expect(getEntityTypeName(GLOBAL_ENUM.EVENT)).toBe(eventType);
    expect(getEntityTypeName(randomType)).toBe(defaultType);
  });
});

describe('ValidatePageTitle', () => {
  const title: string = 'Title ';
  const noTitle: string = 'Sportfolios';
  const WithTitle: string = title + ' | Sportfolios';

  it('should return title', async () => {
    expect(formatPageTitle()).toBe(noTitle);
    expect(formatPageTitle(title)).toBe(WithTitle);
  });
});

describe('ValidateMembershipName', () => {
  const recreationalType: string = 'recreational_member';
  const competitiveType: string = 'competitive_member';
  const eliteType: string = 'elite_member';
  const juniorType: string = 'junior_member';
  const randomType: number = 123;
  const defaultType: string = '';

  it('should return name', async () => {
    expect(getMembershipName(MEMBERSHIP_TYPE_ENUM.RECREATIONAL)).toBe(recreationalType);
    expect(getMembershipName(MEMBERSHIP_TYPE_ENUM.COMPETITIVE)).toBe(competitiveType);
    expect(getMembershipName(MEMBERSHIP_TYPE_ENUM.ELITE)).toBe(eliteType);
    expect(getMembershipName(MEMBERSHIP_TYPE_ENUM.JUNIOR)).toBe(juniorType);
    expect(getMembershipName(randomType)).toBe(defaultType);
  });
});

describe('ValidateMembershipType', () => {
  const oneYearType: string = 'yearly';
  const sixMonthType: string = 'biannual';
  const oneMonthType: string = 'monthly';
  const date: string = 'January 1, 2000';
  const noLength: number = 0;
  const randomLength: number = 123;
  const dateType: any = 'fixed_date';
  const defaultType: any = '';

  it('should return type', async () => {
    expect(getMembershipType(MEMBERSHIP_LENGTH_ENUM.ONE_YEAR)).toBe(oneYearType);
    expect(getMembershipType(MEMBERSHIP_LENGTH_ENUM.SIX_MONTH)).toBe(sixMonthType);
    expect(getMembershipType(MEMBERSHIP_LENGTH_ENUM.ONE_MONTH)).toBe(oneMonthType);
    expect(getMembershipType(MEMBERSHIP_LENGTH_ENUM.ONE_YEAR, date)).toBe(oneYearType);
    expect(getMembershipType(MEMBERSHIP_LENGTH_ENUM.SIX_MONTH, date)).toBe(sixMonthType);
    expect(getMembershipType(MEMBERSHIP_LENGTH_ENUM.ONE_MONTH, date)).toBe(oneMonthType);
    expect(getMembershipType(noLength, date)).toBe(dateType);
    expect(getMembershipType(randomLength, date)).toBe(defaultType);
    expect(getMembershipType(randomLength)).toBe(defaultType);
    expect(getMembershipType()).toBe(defaultType);
  });
});

describe('ValidateMembershipLength', () => {
  const oneMonthType: number = 1;
  const sixMonthType: number = 6;
  const oneYearType: number = 1;
  const randomType: number = 123;
  const noType: undefined = undefined;

  it('should return length', async () => {
    expect(getMembershipLength(MEMBERSHIP_LENGTH_ENUM.ONE_MONTH)).toBe(oneMonthType);
    expect(getMembershipLength(MEMBERSHIP_LENGTH_ENUM.SIX_MONTH)).toBe(sixMonthType);
    expect(getMembershipLength(MEMBERSHIP_LENGTH_ENUM.ONE_YEAR)).toBe(oneYearType);
    expect(getMembershipLength(randomType)).toBe(noType);
  });
});

describe('ValidateMembershipUnit', () => {
  const oneMonthType: moment.unitOfTime.DurationConstructor = 'M';
  const sixMonthType: moment.unitOfTime.DurationConstructor = 'M';
  const oneYearType: moment.unitOfTime.DurationConstructor = 'y';
  const randomType: number = 123;
  const noType: undefined = undefined;

  it('should return unit', async () => {
    expect(getMembershipUnit(MEMBERSHIP_LENGTH_ENUM.ONE_MONTH)).toBe(oneMonthType);
    expect(getMembershipUnit(MEMBERSHIP_LENGTH_ENUM.SIX_MONTH)).toBe(sixMonthType);
    expect(getMembershipUnit(MEMBERSHIP_LENGTH_ENUM.ONE_YEAR)).toBe(oneYearType);
    expect(getMembershipUnit(randomType)).toBe(noType);
  });
});

describe('ValidateExpirationDate', () => {
  const oneMonthDate: any = formatDate(moment.utc().add(1, 'M'));
  const sixMonthDate: any = formatDate(moment.utc().add(6, 'M'));
  const oneYearDate: any = formatDate(moment.utc().add(1, 'y'));
  const randomType: number = 123;
  const currentDate: any = formatDate(moment.utc());
  const previousDate: any = moment.utc().subtract(1, 'year');
  const futureDate: any = moment.utc().add(1, 'month');
  const expectedPreviousDate: any = formatDate(moment.utc().set('year', moment().get('year') + 1));
  const expectedFutureDate: any = formatDate(moment.utc().set('month', moment().get('month') + 1));
  const emptyString: string = '';

  it('should return expiration date', async () => {
    expect(getExpirationDate(MEMBERSHIP_LENGTH_ENUM.ONE_MONTH)).toBe(oneMonthDate);
    expect(getExpirationDate(MEMBERSHIP_LENGTH_ENUM.SIX_MONTH)).toBe(sixMonthDate);
    expect(getExpirationDate(MEMBERSHIP_LENGTH_ENUM.ONE_YEAR)).toBe(oneYearDate);
    expect(getExpirationDate(0, previousDate)).toBe(expectedPreviousDate);
    expect(getExpirationDate(0, currentDate)).toBe(emptyString);
    expect(getExpirationDate(0, futureDate)).toBe(expectedFutureDate);
    expect(getExpirationDate(randomType)).toBe(currentDate);
    expect(getExpirationDate(0, '')).toBe(null);
  });
});

describe('ValidateFormatPrice', () => {
  const price: number = 123;
  const priceDigit: number = 123.123456789;
  const priceString: string = '1.23$';
  const noPrice: string = '0.00$';

  it('should return price', async () => {
    expect(formatPrice(price)).toBe(priceString);
    expect(formatPrice(priceDigit)).toBe(priceString);
    expect(formatPrice()).toBe(noPrice);
    expect(formatPrice(0)).toBe(noPrice);
    expect(formatPrice(undefined)).toBe(noPrice);
  });
});

describe('ValidateDate', () => {
  const badDateMonth: string = '00/01';
  const badDateDay: string = '02/29';
  const badDateMonthType: string = 'bb/01';
  const badDateDayType: string = '02/aa';
  const badDateNoMonth: string = '/01';
  const badDateNoDay: string = '01';
  const noDate: string = '';
  const date: string = '01/01';

  it('should reject bad date', async () => {
    expect(validateDate(badDateMonth)).toBe(false);
    expect(validateDate(badDateNoMonth)).toBe(false);
    expect(validateDate(badDateMonthType)).toBe(false);
    expect(validateDate(badDateDayType)).toBe(false);
    expect(validateDate(badDateNoDay)).toBe(false);
    expect(validateDate(badDateDay)).toBe(false);
    expect(validateDate(noDate)).toBe(false);
  });

  it('should accept a valid date', async () => {
    expect(validateDate(date)).toBe(true);
  });
});

describe('ValidateDateWithYear', () => {
  const badDateMonth: string = '00/01/2000';
  const badDateDay: string = '02/29/2000';
  const badDateMonthType: string = 'bb/01/2000';
  const badDateDayType: string = '02/aa/2000';
  const badDateNoMonth: string = '/01/2000';
  const badDateNoDay: string = '01/2000';
  const badDateYearType: string = '02/01/cccc';
  const badDateNoYear: string = '02/01';
  const noDate: string = '';
  const date: string = '01/01/2000';

  it('should reject bad date', async () => {
    expect(validateDateWithYear(badDateMonth)).toBe(false);
    expect(validateDateWithYear(badDateNoMonth)).toBe(false);
    expect(validateDateWithYear(badDateMonthType)).toBe(false);
    expect(validateDateWithYear(badDateDayType)).toBe(false);
    expect(validateDateWithYear(badDateNoDay)).toBe(false);
    expect(validateDateWithYear(badDateDay)).toBe(false);
    expect(validateDateWithYear(badDateYearType)).toBe(false);
    expect(validateDateWithYear(badDateNoYear)).toBe(false);
    expect(validateDateWithYear(noDate)).toBe(false);
  });

  it('should accept a valid date', async () => {
    expect(validateDateWithYear(date)).toBe(true);
  });
});

describe('ValidateFormattedMailTo', () => {
  const noEmailsMsg: string = 'No email is provided';
  const emailNotArrayMsg: string = 'Emails should be an array';
  const emails: any = ['test, test'];
  const subject: any = 'subject';
  const body: string = 'body';
  const emailNotArray: any = [];
  const emailsString: any = 'test';
  const emailsOnlyFormat: string = 'mailTo:test, test';
  const emailsSubjectFormat: string = 'mailTo:test, test?subject=subject';
  const emailsSubjectBodyFormat: string = 'mailTo:test, test?subject=subject&body=body';

  test('should throw an error', async () => {
    const noEmail = () => {
      getFormattedMailTo();
    };
    const emptyEmail = () => {
      getFormattedMailTo('');
    };
    const emailString = () => {
      getFormattedMailTo(emailsString);
    };
    const emailArrayEmpty = () => {
      getFormattedMailTo(emailNotArray);
    };
    expect(noEmail).toThrow(noEmailsMsg);
    expect(emptyEmail).toThrow(noEmailsMsg);
    expect(emailString).toThrow(emailNotArrayMsg);
    expect(emailArrayEmpty).toThrow(noEmailsMsg);
  });

  it('should return email', async () => {
    expect(getFormattedMailTo(emails)).toBe(emailsOnlyFormat);
    expect(getFormattedMailTo(emails, subject)).toBe(emailsSubjectFormat);
    expect(getFormattedMailTo(emails, subject, body)).toBe(emailsSubjectBodyFormat);
  });
});

describe('ValidateEmail', () => {
  const invalidInput = '123456';
  const invalidInput2 = '123456@';
  const invalidInput3 = '123456@12354';
  const invalidInput4 = '123456@12354.';
  const invalidInput5 = '123456@12354.c';
  const invalidInput6 = '';
  const validInput = 'test@test.com';
  const validInput1 = 'AbCdE@gmail.za';

  it('should reject invalid input', async () => {
    expect(validateEmail(invalidInput)).toBe(false);
    expect(validateEmail(invalidInput2)).toBe(false);
    expect(validateEmail(invalidInput3)).toBe(false);
    expect(validateEmail(invalidInput4)).toBe(false);
    expect(validateEmail(invalidInput5)).toBe(false);
    expect(validateEmail(invalidInput6)).toBe(false);
  });

  it('should accept a valid input', async () => {
    expect(validateEmail(validInput)).toBe(true);
    expect(validateEmail(validInput1)).toBe(true);
  });
});

describe('ValidateTimestampToRelativeTime', () => {
  const secondAgoDate: any = moment.utc();
  const minutesAgoDate: any = moment.utc().subtract(1, 'minutes');
  const hoursAgoDate: any = moment.utc().subtract(1, 'hours');
  const daysAgoDate: any = moment.utc().subtract(1, 'days');
  const monthAgoDate: any = moment.utc().subtract(1, 'month');
  const yearAgoDate: any = moment.utc().subtract(1, 'year');
  const inSeconds: string = '0 seconds ago';
  const inMinutes: string = '1 minute ago';
  const inHours: string = '1 hour ago';
  const inDays: string = '1 day ago';
  const inMonth: string = '1 month ago';
  const inYear: string = '1 year ago';

  it('should return timestamp relative to time', async () => {
    expect(timestampToRelativeTime(secondAgoDate)).toBe(inSeconds);
    expect(timestampToRelativeTime(minutesAgoDate)).toBe(inMinutes);
    expect(timestampToRelativeTime(hoursAgoDate)).toBe(inHours);
    expect(timestampToRelativeTime(daysAgoDate)).toBe(inDays);
    expect(timestampToRelativeTime(monthAgoDate)).toBe(inMonth);
    expect(timestampToRelativeTime(yearAgoDate)).toBe(inYear);
  });
});

describe('ValidateTimeShow', () => {
  const secondAgoDate: any = moment.utc();
  const minutesAgoDate: any = moment.utc().subtract(1, 'minutes');
  const hoursAgoDate: any = moment.utc().subtract(1, 'hours');
  const daysAgoDate: any = moment.utc().subtract(1, 'days');
  const monthAgoDate: any = moment.utc().subtract(1, 'month');
  const inSeconds: string = 'il y a quelques secondes';
  const inMinutes: string = 'il y a une minute';
  const inHours: string = 'il y a une heure';
  const aDayAgo: string = 'Yesterday, at ' + daysAgoDate.format('HH:mm');
  const overADay: string = monthAgoDate.format('DD MMMM YYYY');

  it('should return time show', async () => {
    expect(getTimeToShow(secondAgoDate)).toBe(inSeconds);
    expect(getTimeToShow(minutesAgoDate)).toBe(inMinutes);
    expect(getTimeToShow(hoursAgoDate)).toBe(inHours);
    expect(getTimeToShow(daysAgoDate)).toBe(aDayAgo);
    expect(getTimeToShow(monthAgoDate)).toBe(overADay);
  });
});
