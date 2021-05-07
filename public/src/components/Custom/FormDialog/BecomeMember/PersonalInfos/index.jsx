import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import BasicFormDialog from '../../BasicFormDialog';
import moment from 'moment';
import { COMPONENT_TYPE_ENUM, GENDER_ENUM } from '../../../../../../common/enums';
import { Store } from '../../../../../Store';

export default function PersonalInfos(props) {
  const { open: openProps, onClose, formik } = props;
  const { t } = useTranslation();
  const {
    state: { userInfo },
  } = useContext(Store);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const [open, setOpen] = useState(false);

  const addressChanged = (newAddress) => {
    formik.setFieldValue('address', newAddress);
  };

  const fields = [
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
    <BasicFormDialog
      open={open}
      title={t('person.personal_information')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
