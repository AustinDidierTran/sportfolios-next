import React, { useState, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../../../../../actions/api';
import BasicFormDialog from '../../BasicFormDialog';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../../Store';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { formatRoute } from '../../../../../../common/utils/stringFormat';

export default function OptionalInformations(props) {
  const { open: openProps, onClose, organizationId, membershipCreatedId, personId } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [open, setOpen] = useState(false);
  const [hideDonate, setHideDonate] = useState(true);
  const [organizationName, setOrganizationName] = useState('');

  useEffect(() => {
    setHideDonate(true);
    setOpen(openProps);
    getOrganizationName(organizationId);
  }, [openProps]);

  const getOrganizationName = async (entityId) => {
    const { data } = await api(formatRoute('/api/entity/generalInfos', null, { entityId }));
    if (!data) {
      return;
    }

    setOrganizationName(data.name);
  };

  const handleChange = async () => {
    formik.setFieldValue('gettingInvolved', !formik.values.gettingInvolved);
  };

  const handleDonation = async () => {
    setHideDonate((hideDonate) => !hideDonate);
    formik.setFieldValue('makeDonation', !formik.values.makeDonation);
  };

  const handleAnonyme = async () => {
    formik.setFieldValue('isAnonyme', !formik.values.isAnonyme);
  };

  const validationSchema = yup.object().shape({
    heardOrganization: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
      if (!val) {
        return true;
      }
      return val.length <= 255;
    }),
    donationNote: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
      if (!val) {
        return true;
      }
      return val.length <= 255;
    }),
  });

  const formik = useFormik({
    initialValues: {
      heardOrganization: '',
      gettingInvolved: false,
      frequentedSchool: '',
      jobTitle: '',
      employer: '',
      makeDonation: false,
      donationAmount: '',
      customDonationAmount: '',
      donationNote: '',
      isAnonyme: false,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const {
        heardOrganization,
        gettingInvolved,
        frequentedSchool,
        jobTitle,
        employer,
        makeDonation,
        donationAmount,
        customDonationAmount,
        donationNote,
        isAnonyme,
      } = values;
      const resOptional = await api(`/api/entity/memberOptionalField`, {
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

      let amount, anonyme, userId, note;
      if (makeDonation) {
        if (donationAmount == t('Other')) {
          amount = Math.floor(customDonationAmount * 100);
        } else {
          amount = donationAmount;
        }
        userId = personId;
        anonyme = isAnonyme;
        note = donationNote;

        const resDonation = await api(`/api/entity/memberDonation`, {
          method: 'POST',
          body: JSON.stringify({
            amount,
            anonyme,
            note,
            organizationId,
            userId,
          }),
        });

        if (resDonation.status === STATUS_ENUM.ERROR || resDonation.status >= 400) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: ERROR_ENUM.ERROR_OCCURED,
            severity: SEVERITY_ENUM.ERROR,
            duration: 4000,
          });
        }
      }
      if (resOptional.status === STATUS_ENUM.ERROR || resOptional.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        onClose();
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

  const customAmount = useMemo(() => formik.values.donationAmount === t('Other'), [formik.values.donationAmount]);

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
          onChange: customAmount,
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
    customAmount && !hideDonate
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
