import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  REQUEST_STATUS_ENUM,
  COMPONENT_TYPE_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  TABS_ENUM,
} from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatDate, formatPrice, getMembershipName } from '../../../../utils/stringFormats';
import moment from 'moment';
import { getExpirationDate } from '../../../../utils/memberships';
import * as yup from 'yup';
import UpdatePersonalInfos from './UpdatePersonalInfos';
import PersonalInfos from './PersonalInfos';
import OptionalInformations from './OptionalInformations';
import TermsAndConditions from './TermsAndConditions';
import DonationInfos from './DonationInfos';
import GoToCart from './GoToCart';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { useRouter } from 'next/router';
import {
  getPrimaryPerson,
  getMemberships as getMembershipsApi,
  getPersonInfos as getPersonInfosApi,
} from '../../../../actions/service/entity/get';
import { getOwnedPerson } from '../../../../actions/service/user';
import { addMember, addMemberWithCoupon } from '../../../../actions/service/entity/post';

export default function BecomeMember(props) {
  const { open: openProps, update, onClose, onOpen, moreInfo = true, defaultTypeValue } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo, id },
  } = useContext(Store);

  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState(false);
  const [updateInfos, setUpdateInfos] = useState(false);
  const [goToCart, setGoToCart] = useState(false);
  const [personalInfos, setPersonalInfos] = useState(false);
  const [optionalInformations, setOptionalInformations] = useState(false);
  const [donationsInfos, setDonationInfos] = useState(false);
  const [personInfos, setPersonInfos] = useState({});
  const [people, setPeople] = useState(userInfo.persons);
  const [memberships, setMemberships] = useState([]);
  const [fullMemberships, setFullMemberships] = useState([]);
  const [membership, setMembership] = useState(null);
  const [membershipCreatedId, setMembershipCreatedId] = useState('');
  const [personId, setPersonId] = useState('');
  const [organizationId, setOrganizationId] = useState('');

  useEffect(() => {
    getPeople();
    getMemberships();
  }, [openProps, id]);

  useEffect(() => {
    if (router.query.coupon) {
      onNext();
    } else {
      setOpen(openProps);
    }
  }, [openProps]);

  const getPersonInfos = async (person) => {
    if (person) {
      const data = await getPersonInfosApi(person);
      formik.setFieldValue('birthDate', data?.birthDate || '');
      formik.setFieldValue('gender', data?.gender || '');
      formik.setFieldValue('address', data?.address || '');
      formik.setFieldValue('phoneNumber', data?.phoneNumber || '');
      formik.setFieldValue('formattedAddress', data?.formattedAddress || '');
      formik.setFieldValue('addressValid', data?.formattedAddress ? true : false || false);
      formik.setFieldValue('emergencyName', data?.emergencyName || '');
      formik.setFieldValue('emergencySurname', data?.emergencySurname || '');
      formik.setFieldValue('emergencyPhoneNumber', data?.emergencyPhoneNumber || '');
      formik.setFieldValue('medicalConditions', data?.medicalConditions || '');
      setPersonInfos(data);
    }
  };

  const getPeople = async () => {
    const data = await getPrimaryPerson();
    if (!data) {
      return;
    }
    const people = await getOwnedPerson();
    const res = people.map((p) => ({
      value: p.id,
      display: `${p.name} ${p?.surname}`,
    }));
    setPeople(res);

    if (!formik.values.person) {
      formik.setFieldValue('person', data.id);
    }
  };

  const getMemberships = async () => {
    if (router.query.membership) {
      setMembership(router.query.membership);
    } else if (id) {
      const data = await getMembershipsApi(id);
      setFullMemberships(data);
      const memberships = data.map((d) => ({
        value: d.id,
        display: formatMembership(d),
      }));
      setMemberships(memberships);
      if (defaultTypeValue) {
        formik.setFieldValue('type', defaultTypeValue);
      } else if (memberships[0] && !memberships.map(m => m.value).includes(formik.values.type)) {
        formik.setFieldValue('type', memberships[0].value);
      }
    }
  };

  const formatMembership = (membership) => {
    const { length, fixedDate, membershipType, price } = membership;
    const name = getMembershipName(membershipType);
    if (length) {
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
        return `${name} | ${formatPrice(price)} (${t('one_year')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
        return `${name} | ${formatPrice(price)} (${t('six_month')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
        return `${name} | ${formatPrice(price)} (${t('one_month')})`;
      }
    }
    if (fixedDate) {
      let finalDate;
      if (moment(new Date(fixedDate)).set('year', moment().get('year')) < moment()) {
        finalDate = moment(new Date(fixedDate)).set('year', moment().get('year')).add(1, 'year');
      } else {
        finalDate = moment(new Date(fixedDate)).set('year', moment().get('year'));
      }
      return `${t(name)} | ${formatPrice(price)} (${formatDate(finalDate)})`;
    }
    return null;
  };
  const validationSchema = yup.object().shape({
    type: yup.string().test('validate', t(ERROR_ENUM.VALUE_IS_REQUIRED), (val) => {
      if (router.query.coupon) {
        return true;
      }
      return Boolean(val);
    }),
    birthDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    gender: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    phoneNumber: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
      if (!val) {
        return false;
      }
      return val.length === 10;
    }),
    formattedAddress: yup.string().test('validate', () => {
      return formik.values.addressValid;
    }),
    emergencyName: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    emergencySurname: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    emergencyPhoneNumber: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
      if (!val) {
        return false;
      }
      return val.length === 10;
    }),
  });

  const formik = useFormik({
    initialValues: {
      person: '',
      type: '',
      birthDate: '',
      gender: '',
      phoneNumber: '',
      address: '',
      formattedAddress: '',
      addressValid: '',
      emergencyName: '',
      emergencySurname: '',
      medicalConditions: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const {
        person,
        type,
        birthDate,
        gender,
        phoneNumber,
        address,
        emergencyName,
        emergencySurname,
        emergencyPhoneNumber,
        medicalConditions,
      } = values;
      let res = null;
      if (router.query.coupon) {
        res = await addMemberWithCoupon({
          membershipId: membership.id,
          membershipType: membership.membershipType,
          organizationId: membership.entityId,
          termsAndConditionsId: membership.termsAndConditionsId,
          personId: person,
          expirationDate: router.query.expirationDate,
          birthDate,
          gender,
          phoneNumber,
          address,
          emergencyName,
          emergencySurname,
          emergencyPhoneNumber,
          medicalConditions,
          tokenId: router.query.tokenId,
        });
      } else {
        res = await addMember({
          membershipId: type,
          membershipType: membership.membershipType,
          organizationId: membership.entityId,
          personId: person,
          expirationDate: getExpirationDate(membership.length, membership.fixedDate),
          birthDate,
          gender,
          phoneNumber,
          address,
          emergencyName,
          emergencySurname,
          emergencyPhoneNumber,
          medicalConditions,
        });
      }

      if (res.status === REQUEST_STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        setPersonalInfos(false);
        setOrganizationId(membership.entityId);
        if (hasChanged()) {
          setUpdateInfos(true);
        } else {
          setOptionalInformations(true);
        }
        setMembershipCreatedId(res.data.id);
        setPersonId(person);
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('member.membership_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
        update();
      }
    },
  });

  useEffect(() => {
    setMembership(fullMemberships.find((m) => m.id === formik.values.type));
  }, [formik.values.type]);

  const hasTerms = useMemo(() => {
    if (membership) {
      return membership.description || membership.file_url;
    }
    return false;
  }, [membership]);

  const hasChanged = () => {
    return (
      personInfos.birthDate != formik.values.birthDate ||
      personInfos.gender != formik.values.gender ||
      personInfos.formattedAddress != formik.values.formattedAddress ||
      personInfos.phoneNumber != formik.values.phoneNumber ||
      personInfos.emergencyName != formik.values.emergencyName ||
      personInfos.emergencySurname != formik.values.emergencySurname ||
      personInfos.emergencyPhoneNumber != formik.values.emergencyPhoneNumber ||
      personInfos.medicalConditions != formik.values.medicalConditions
    );
  };

  useEffect(() => {
    getPersonInfos(formik.values.person);
  }, [formik.values.person]);

  useEffect(() => {
    if (terms) {
      setPersonalInfos(false);
    }
  }, [terms]);

  const onClickMoreInfo = () => {
    goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.MEMBERSHIPS });
    onClose();
  };

  const onNext = () => {
    onClose();
    if (hasTerms) {
      setTerms(true);
    } else {
      setPersonalInfos(true);
    }
  };

  const onTermsNext = () => {
    setTerms(false);
    setPersonalInfos(true);
  };

  const onTermsClose = () => {
    setTerms(false);
    onOpen();
  };

  const onPersonalInfosClose = () => {
    setPersonalInfos(false);
    if (hasTerms) {
      setTerms(true);
    } else {
      onOpen();
    }
  };

  const onDonationInfosClose = () => {
    setDonationInfos(false);
    if (membership.price > 0 && !router.query.coupon) {
      setGoToCart(true);
    } else {
      formik.resetForm();
    }
  };

  const onOptionalInformationsClose = () => {
    setOptionalInformations(false);
    setDonationInfos(true);
  };

  const onAddDonation = () => {
    setGoToCart(true);
  };

  const onGoToCartClose = () => {
    setGoToCart(false);
    formik.resetForm();
  };

  const onUpdateInfosClose = () => {
    setUpdateInfos(false);
    setOptionalInformations(true);
  };

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'person',
      label: t('person.person'),
      options: people,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'type',
      label: t('type'),
      options: memberships,
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: onNext,
      name: t('next'),
      color: 'primary',
    },
  ];

  return (
    <>
      <BasicFormDialog
        open={open}
        title={t('become_member')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={onClose}
        showSubtitle={moreInfo}
        subtitle={t('learn_more')}
        subtitleOnClick={onClickMoreInfo}
      />
      <TermsAndConditions
        open={terms}
        onClose={onTermsClose}
        formik={formik}
        onNext={onTermsNext}
        membership={membership}
      />
      <PersonalInfos open={personalInfos} formik={formik} onClose={onPersonalInfosClose} />
      <UpdatePersonalInfos open={updateInfos} onClose={onUpdateInfosClose} formik={formik} />
      <OptionalInformations
        membershipCreatedId={membershipCreatedId}
        open={optionalInformations}
        onClose={onOptionalInformationsClose}
      />
      <DonationInfos
        open={donationsInfos}
        onClose={onDonationInfosClose}
        onAddDonation={onAddDonation}
        personId={personId}
        organizationId={organizationId}
      />
      <GoToCart open={goToCart} onClose={onGoToCartClose} />
    </>
  );
}
