import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import BasicFormDialog from '../../BasicFormDialog';
import { COMPONENT_TYPE_ENUM } from '../../../../../../common/enums';

export default function OptionalInformations(props) {
  const { open: openProps, onClose, formik, organizationName } = props;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [gettingInvolved, setGettingInvolved] = useState(false);
  const [hideDonate, setHideDonate] = useState(true);
  const [anonyme, setAnonyme] = useState(false);
  const [customAmountCss, setCustomAmountCss] = useState({ display: 'None' });

  useEffect(() => {
    setHideDonate(true);
    setOpen(openProps);
  }, [openProps]);

  const handleChange = async () => {
    formik.values.gettingInvolved = !gettingInvolved;
    setGettingInvolved(!gettingInvolved);
  };

  const handleDonation = async () => {
    setHideDonate(!hideDonate);
    formik.setFieldValue('makeDonation', hideDonate);
  };

  const handleAnonyme = async () => {
    formik.setFieldValue('isAnonyme', !anonyme);
    setAnonyme(!anonyme);
  };

  const handleDonationPrice = async (val) => {
    if (val == t('Other')) {
      setCustomAmountCss({});
    } else {
      setCustomAmountCss({ display: 'None' });
    }
  };

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
      namespace: 'heardOrganization',
      label: t('heard_organization'),
      variant: 'filled',
      rows: 2,
      rowsMax: 5,
      style: { width: '100%' },
      formik,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
      namespace: 'gettingInvolved',
      label: t('getting_involved'),
      onChange: handleChange,
      formik,
    },
    {
      namespace: 'frequentedSchool',
      label: t('frequented_school'),
      formik,
    },
    {
      namespace: 'jobTitle',
      label: t('job_title'),
      formik,
    },
    {
      namespace: 'employer',
      label: t('employer'),
      formik,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.DIVIDER,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('donate'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
      namespace: 'makeDonation',
      label: t('make_donation', {
        organizationName,
      }),
      onChange: handleDonation,
      formik,
    },
    !hideDonate
      ? {
          namespace: 'donationAmount',
          label: t('donation_amount'),
          componentType: COMPONENT_TYPE_ENUM.SELECT,
          onChange: handleDonationPrice,
          options: [
            { value: '20', display: '20$' },
            { value: '50', display: '50$' },
            { value: '100', display: '100$' },
            { value: t('Other'), display: t('Other') },
          ],
          required: true,
          formik,
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.EMPTY,
        },
    {
      namespace: 'customDonationAmount',
      label: t('custom_donation_amount'),
      type: 'number',
      min: '10',
      style: customAmountCss,
      endAdorment: '$',
      hidden: hideDonate,
      formik,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
      namespace: 'donationNote',
      label: t('donation_note'),
      variant: 'filled',
      rows: 2,
      rowsMax: 4,
      style: { width: '100%' },
      disabled: hideDonate,
      formik,
    },
    !hideDonate
      ? {
          componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
          namespace: 'isAnonyme',
          label: t('i_want_to_be_anonyme'),
          onChange: handleAnonyme,
          formik,
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.EMPTY,
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
      title={t('improvement_feedback')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
