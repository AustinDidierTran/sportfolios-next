import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM } from '../../../../../../common/enums';

import BasicFormDialog from '../../BasicFormDialog';

export default function TermsAndConditions(props) {
  const { open: openProps, onClose, onNext, formik, membership } = props;
  const { t } = useTranslation();

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const [open, setOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
      style: { width: '100%', whiteSpace: 'pre-wrap', overflow: 'auto' },
      disabled: true,
      value: membership?.description,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LINK,
      name: membership?.file_name,
      href: membership?.file_url,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.CHECKBOX,
      label: t('accept_terms_and_conditions'),
      checked: accepted,
      onChange: () => {
        setAccepted(!accepted);
      },
      color: 'primary',
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('back'),
      color: 'secondary',
    },
    {
      onClick: onNext,
      name: t('next'),
      color: 'primary',
      disabled: !accepted,
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('terms_and_conditions')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
