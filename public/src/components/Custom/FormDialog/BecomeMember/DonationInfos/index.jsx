import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../../../../../actions/api';
import BasicFormDialog from '../../BasicFormDialog';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../../Store';
import * as yup from 'yup';
import { useFormik } from 'formik';
import styles from './DonationInfos.module.css';

export default function DonationInfos(props) {
  const { open: openProps, onClose, organizationId, personId, onAddDonation } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const handleAnonyme = async () => {
    formik.setFieldValue('isAnonyme', !formik.values.isAnonyme);
  };

  const validationSchema = yup.object().shape({
    donationNote: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
      if (!val) {
        return true;
      }
      return val.length <= 255;
    }),
  });

  const formik = useFormik({
    initialValues: {
      donationAmount: '',
      customDonationAmount: '',
      donationNote: '',
      isAnonyme: false,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { donationAmount, customDonationAmount, donationNote, isAnonyme } = values;

      let amount, anonyme, note;

      if (donationAmount == t('Other')) {
        amount = Math.floor(customDonationAmount * 100);
      } else {
        amount = Math.floor(donationAmount * 100);
      }
      anonyme = isAnonyme;
      note = donationNote;

      const res = await api(`/api/entity/memberDonation`, {
        method: 'POST',
        body: JSON.stringify({
          amount,
          anonyme,
          note,
          organizationId,
          personId,
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
        onClose();
        resetForm();
        onAddDonation();
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('donation_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
      }
    },
  });

  const customAmount = useMemo(() => formik.values.donationAmount === t('Other'), [formik.values.donationAmount]);

  const fields = [
    {
      namespace: 'donationAmount',
      label: t('donation_amount'),
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: [
        { value: '20', display: '20$' },
        { value: '50', display: '50$' },
        { value: '100', display: '100$' },
        { value: t('Other'), display: t('Other') },
      ],
      required: true,
      formik,
    },
    customAmount
      ? {
          namespace: 'customDonationAmount',
          label: t('custom_donation_amount'),
          type: 'number',
          required: customAmount,
          min: '10',
          endAdorment: '$',
          formik,
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.EMPTY,
        },
    {
      componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
      namespace: 'donationNote',
      label: t('donation_note'),
      variant: 'filled',
      rows: 2,
      rowsMax: 4,
      style: { width: '100%' },
      formik,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
      namespace: 'isAnonyme',
      label: t('i_want_to_be_anonyme'),
      onChange: handleAnonyme,
      formik,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      secondaryTypographyProps: { variant: 'h1', className: styles.small },
      secondary: '*' + t('donation_fees'),
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('skip'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('send'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('donate')}
      subtitle={t('donation_message')}
      showSubtitle
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
