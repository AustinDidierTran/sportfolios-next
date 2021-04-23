import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  COMPONENT_TYPE_ENUM,
  GLOBAL_ENUM,
  STATUS_ENUM,
  TABS_ENUM,
  GENDER_ENUM,
} from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import { formatRoute } from '../../../../../common/utils/stringFormat';
import * as yup from 'yup';
import UpdatePersonalInfos from '../BecomeMember/UpdatePersonalInfos';

export default function BecomeMemberCoupon(props) {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { userInfo },
  } = useContext(Store);

  const { open: openProps, onClose, items } = props;
  const { metadata, token_id } = items;
  const { expirationDate, membershipType, organizationId } = metadata;
  const [people, setPeople] = useState([]);
  const [open, setOpen] = useState(false);
  const [personalInfos, setPersonalInfos] = useState(false);
  const [personInfos, setPersonInfos] = useState({});
  const [updateInfos, setUpdateInfos] = useState(false);
  const [organization, setOrganization] = useState({});

  useEffect(() => {
    setOpen(openProps);
    getPeople();
  }, [openProps]);

  useEffect(() => {
    getOrganization();
  }, [organizationId]);

  const getOrganization = async () => {
    const { data } = await api(
      formatRoute('/api/entity', null, {
        id: organizationId,
      })
    );
    setOrganization(data);
  };

  const getPeople = async () => {
    const { data } = await api(
      formatRoute('/api/user/ownedPersons', null, {
        type: GLOBAL_ENUM.PERSON,
      })
    );
    //Permet de mettre la primary person comme 1er élément de la liste
    for (var i = 0; i < data.length; i++) {
      if (data[i].isPrimaryPerson) {
        data.unshift(data.splice(i, 1)[0]);
        break;
      }
    }
    const res = data.map((d) => ({
      display: d.complete_name,
      value: d.id,
    }));
    setPeople(res);
    formik.setFieldValue('person', res[0].value);
  };

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

  const validationSchema = yup.object().shape({
    person: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    address: yup.object().shape({
      street_address: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    }),
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
      birthDate: '',
      gender: '',
      phoneNumber: '',
      address: '',
      formattedAddress: '',
      emergencyName: '',
      emergencySurname: '',
      emergencyPhoneNumber: '',
      medicalConditions: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const {
        person,
        birthDate,
        gender,
        phoneNumber,
        address,
        emergencyName,
        emergencySurname,
        emergencyPhoneNumber,
        medicalConditions,
      } = values;
      const res = await api(`/api/entity/memberManually`, {
        method: 'POST',
        body: JSON.stringify({
          membershipType,
          organizationId,
          personId: person,
          birthDate,
          gender,
          phoneNumber,
          address,
          emergencyName,
          emergencySurname,
          emergencyPhoneNumber,
          medicalConditions,
          expirationDate: new Date(expirationDate),
        }),
      });
      if (res.status === STATUS_ENUM.SUCCESS) {
        await api(`/api/user/useToken`, {
          method: 'PUT',
          body: JSON.stringify({
            tokenId: token_id,
          }),
        });
        setPersonalInfos(false);
        if (hasChanged()) {
          setUpdateInfos(true);
        } else {
          goTo(ROUTES.entity, { id: organizationId }, { tab: TABS_ENUM.MEMBERSHIPS });
          resetForm();
        }
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      }
    },
  });

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

  const addressChanged = (newAddress) => {
    formik.setFieldValue('address', newAddress);
  };

  const onUpdateInfosClose = () => {
    setUpdateInfos(false);
    formik.resetForm();
    goTo(ROUTES.entity, { id: organizationId }, { tab: TABS_ENUM.MEMBERSHIPS });
  };

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('become_member_of', {
        organizationName: organization?.basicInfos?.name || '',
        expirationDate: formatDate(moment(expirationDate)),
      }),
    },
    people.length === 1
      ? {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primary: people[0]?.display,
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.SELECT,
          namespace: 'person',
          label: t('person.person'),
          options: people,
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
        setOpen(false);
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
        setOpen(true);
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
        title={t('member.member_coupon')}
        description={t('this_coupon_is_only_good_once')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={onClose}
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
    </>
  );
}
