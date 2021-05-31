import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';

export default function JoinTeam(props) {
  const { open: openProps, onClose } = props;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('cant_join_team_yet'),
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: () => {},
      name: t('next'),
      color: 'primary',
      disabled: true,
    },
  ];

  return <BasicFormDialog open={open} title={t('join_team')} buttons={buttons} fields={fields} onClose={onClose} />;
}
