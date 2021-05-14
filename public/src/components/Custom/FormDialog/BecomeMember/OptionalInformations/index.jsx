import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import BasicFormDialog from '../../BasicFormDialog';
import { COMPONENT_TYPE_ENUM } from '../../../../../../common/enums';

export default function OptionalInformations(props) {
  const { open: openProps, onClose, formik } = props;
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const [open, setOpen] = useState(false);
  const [gettingInvolved, setGettingInvolved] = useState(false);

  const handleChange = async () => {
    formik.values.gettingInvolved = !gettingInvolved;
    setGettingInvolved(!gettingInvolved);
  };

  const fields = [
    {
      namespace: 'heardOrganization',
      label: t('heard_organization'),
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
