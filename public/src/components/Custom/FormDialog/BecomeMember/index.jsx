import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  COMPONENT_TYPE_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  TABS_ENUM,
  GLOBAL_ENUM,
} from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatDate, formatPrice, getMembershipName } from '../../../../utils/stringFormats';
import moment from 'moment';
import { getExpirationDate } from '../../../../utils/memberships';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../../common/utils/stringFormat';
import * as yup from 'yup';
import UpdatePersonalInfos from './UpdatePersonalInfos';
import PersonalInfos from './PersonalInfos';
import OptionalInformations from './OptionalInformations';
import TermsAndConditions from './TermsAndConditions';
import GoToCart from './GoToCart';
import { goTo, ROUTES } from '../../../../actions/goTo';

export default function BecomeMember(props) {
  const { open: openProps, update, onClose, onOpen, moreInfo = true, defaultTypeValue } = props;

  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);
  const router = useRouter();
  const { id } = router.query;

  const [open, setOpen] = useState(false);
  const [terms, setTerms] = useState(false);
  const [updateInfos, setUpdateInfos] = useState(false);
  const [goToCart, setGoToCart] = useState(false);
  const [personalInfos, setPersonalInfos] = useState(false);
  const [optionalInformations, setOptionalInformations] = useState(false);
  const [personInfos, setPersonInfos] = useState({});
  const [people, setPeople] = useState(userInfo.people);
  const [memberships, setMemberships] = useState([]);
  const [fullMemberships, setFullMemberships] = useState([]);
  const [membershipCreatedId, setMembershipCreatedId] = useState('');

  useEffect(() => {
    if (openProps) {
      getPeople();
      getMemberships();
    }
    if (!router.query.coupon) {
      setOpen(openProps);
    } else {
      onNext();
    }
  }, [openProps]);

  const getPersonInfos = async (person) => {
    if (person) {
      const { data } = await api(
        formatRoute('/api/entity/personInfos', null, {
          entityId: person,
        })
      );

      formik.setFieldValue('birthDate', data?.birthDate || '');
      formik.setFieldValue('gender', data?.gender || '');
      formik.setFieldValue('address', data?.address || '');
      formik.setFieldValue('phoneNumber', data?.phoneNumber || '');
      formik.setFieldValue('formattedAddress', data?.formattedAddress || '');
      formik.setFieldValue('emergencyName', data?.emergencyName || '');
      formik.setFieldValue('emergencySurname', data?.emergencySurname || '');
      formik.setFieldValue('emergencyPhoneNumber', data?.emergencyPhoneNumber || '');
      formik.setFieldValue('medicalConditions', data?.medicalConditions || '');
      setPersonInfos(data);
    }
  };

  const getPeople = async () => {
    const { data } = await api(formatRoute('/api/entity/primaryPerson', null, null));
    if (!data) {
      return;
    }
    const { data: people } = await api(
      formatRoute('/api/user/ownedPersons', null, {
        type: GLOBAL_ENUM.PERSON,
      })
    );
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
    const { data } = await api(
      formatRoute('/api/entity/memberships', null, {
        id,
      })
    );
    setFullMemberships(data);
    const memberships = data.map((d) => ({
      value: d.id,
      display: formatMembership(d),
    }));
    setMemberships(memberships);
    if (defaultTypeValue) {
      formik.setFieldValue('type', defaultTypeValue);
    } else if (memberships[0]) {
      formik.setFieldValue('type', memberships[0].value);
    }
  };

  const formatMembership = (membership) => {
    const { length, fixed_date, membership_type, price } = membership;
    const name = getMembershipName(membership_type);
    if (length) {
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_YEAR) {
        return `${t(name)} | ${formatPrice(price)} (${t('one_year')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.SIX_MONTH) {
        return `${t(name)} | ${formatPrice(price)} (${t('six_month')})`;
      }
      if (length === MEMBERSHIP_LENGTH_ENUM.ONE_MONTH) {
        return `${t(name)} | ${formatPrice(price)} (${t('one_month')})`;
      }
    }
    if (fixed_date) {
      let finalDate;
      if (moment(new Date(fixed_date)).set('year', moment().get('year')) < moment()) {
        finalDate = moment(new Date(fixed_date)).set('year', moment().get('year')).add(1, 'year');
      } else {
        finalDate = moment(new Date(fixed_date)).set('year', moment().get('year'));
      }
      return `${t(name)} | ${formatPrice(price)} (${formatDate(finalDate)})`;
    }
    return null;
  };

  const validationSchema = yup.object().shape({
    address: yup.object().shape({
      street_address: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    }),
    type: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    birthDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    gender: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    phoneNumber: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
      if (!val) {
        return false;
      }
      return val.length === 10;
    }),
    formattedAddress: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
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
      const res = await api(`/api/entity/member`, {
        method: 'POST',
        body: JSON.stringify({
          membershipId: type,
          membershipType: membership.membership_type,
          organizationId: membership.entity_id,
          personId: person,
          expirationDate: router.query.expirationDate || getExpirationDate(membership.length, membership.fixed_date),
          birthDate,
          gender,
          phoneNumber,
          address,
          emergencyName,
          emergencySurname,
          emergencyPhoneNumber,
          medicalConditions,
        }),
      });
      if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        setPersonalInfos(false);
        if (hasChanged()) {
          setUpdateInfos(true);
        } else {
          setOptionalInformations(true);
        }
        setMembershipCreatedId(res.data.id);

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

  const formikOptional = useFormik({
    initialValues: {
      heardOrganization: '',
      gettingInvolved: false,
      frequentedSchool: '',
      jobTitle: '',
      employer: '',
    },
    onSubmit: async (values, { resetForm }) => {
      const { heardOrganization, gettingInvolved, frequentedSchool, jobTitle, employer } = values;
      const res = await api(`/api/entity/memberOptionalField`, {
        method: 'PUT',
        body: JSON.stringify({
          membershipId: membershipCreatedId,
          heardOrganization,
          gettingInvolved,
          frequentedSchool,
          jobTitle,
          employer,
        }),
      });
      if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        resetForm();
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('member.membership_optional_info_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
      }
    },
  });

  const membership = useMemo(() => fullMemberships.find((m) => m.id === formik.values.type), [formik.values.type]);

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

  const onClickMoreInfo = () => {
    goTo(ROUTES.entity, { id }, { tab: TABS_ENUM.membership });
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

  const onOptionalInformationsClose = () => {
    setOptionalInformations(false);
    if (membership.price > 0) {
      setGoToCart(true);
    } else {
      formik.resetForm();
    }
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
      <OptionalInformations open={optionalInformations} formik={formikOptional} onClose={onOptionalInformationsClose} />
      <GoToCart open={goToCart} onClose={onGoToCartClose} />
    </>
  );
}
