import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../../../../../actions/api';
import BasicFormDialog from '../../BasicFormDialog';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../../Store';
import * as yup from 'yup';
import { useFormik } from 'formik';

export default function OptionalInformations(props) {
  const { open: openProps, onClose, membershipCreatedId } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const handleChange = async () => {
    formik.setFieldValue('gettingInvolved', !formik.values.gettingInvolved);
  };

  const validationSchema = yup.object().shape({
    heardOrganization: yup.string().test('len', t(ERROR_ENUM.VALUE_IS_INVALID), (val) => {
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
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
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
      if (res.status === REQUEST_STATUS_ENUM.ERROR || res.status >= 400) {
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
