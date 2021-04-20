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
  GENDER_ENUM,
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
  const [updateInfos, setUpdateInfos] = useState(false);
  const [goToCart, setGoToCart] = useState(false);
  const [personalInfos, setPersonalInfos] = useState(false);
  const [personInfos, setPersonInfos] = useState({});
  const [people, setPeople] = useState(userInfo.people);
  const [memberships, setMemberships] = useState([]);
  const [fullMemberships, setFullMemberships] = useState([]);

  useEffect(() => {
    if (openProps) {
      getPeople();
      getMemberships();
    }
    setOpen(openProps);
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
    onSubmit: async (values, { resetForm }) => {
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
          expirationDate: getExpirationDate(membership.length, membership.fixed_date),
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
        } else if (membership.price > 0) {
          setGoToCart(true);
        } else {
          resetForm();
        }
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

  const membership = useMemo(() => fullMemberships.find((m) => m.id === formik.values.type), [formik.values.type]);

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

  const addressChanged = (newAddress) => {
    formik.setFieldValue('address', newAddress);
  };

  const onGoToCartClose = () => {
    setGoToCart(false);
    formik.resetForm();
  };

  const onUpdateInfosClose = () => {
    setUpdateInfos(false);
    if (membership.price > 0) {
      setGoToCart(true);
    } else {
      formik.resetForm();
    }
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

  const infosFields = [
    {
      namespace: 'birthDate',
      InputProps: {
        inputProps: {
          max: moment(new Date()).format('YYYY-MM-DD'),
        },
      },
      helperText: t('birth_date'),
      type: 'date',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'gender',
      label: t('gender'),
      options: [
        { value: GENDER_ENUM.MALE, display: t('male') },
        { value: GENDER_ENUM.FEMALE, display: t('female') },
        { value: GENDER_ENUM.NOT_SPECIFIED, display: t('do_not_specify') },
      ],
    },
    {
      componentType: COMPONENT_TYPE_ENUM.PHONE_NUMBER,
      namespace: 'phoneNumber',
      label: t('phone_number'),
      formik,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.ADDRESS,
      namespace: 'formattedAddress',
      language: userInfo.language,
      country: 'ca',
      addressChanged,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.DIVIDER,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('emergency_contact'),
    },
    {
      namespace: 'emergencyName',
      label: t('name'),
      formik,
    },
    {
      namespace: 'emergencySurname',
      label: t('surname'),
      formik,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.PHONE_NUMBER,
      namespace: 'emergencyPhoneNumber',
      label: t('phone_number'),
      formik,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
      namespace: 'medicalConditions',
      label: t('medical_conditions'),
      variant: 'filled',
      rows: 5,
      rowsMax: 5,
      style: { width: '100%' },
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: () => {
        onClose();
        setPersonalInfos(true);
      },
      name: t('next'),
      color: 'primary',
    },
  ];
  const infosButtons = [
    {
      onClick: () => {
        setPersonalInfos(false);
        onOpen();
      },
      name: t('back'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('finish'),
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
      <BasicFormDialog
        open={personalInfos}
        title={t('person.personal_information')}
        buttons={infosButtons}
        fields={infosFields}
        formik={formik}
        onClose={() => {
          setPersonalInfos(false);
        }}
      />
      <UpdatePersonalInfos open={updateInfos} onClose={onUpdateInfosClose} formik={formik} />
      <GoToCart open={goToCart} onClose={onGoToCartClose} />
    </>
  );
}
