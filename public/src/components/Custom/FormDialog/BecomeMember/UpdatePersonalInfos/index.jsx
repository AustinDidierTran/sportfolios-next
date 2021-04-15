import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { STATUS_ENUM, SEVERITY_ENUM, ERROR_ENUM } from '../../../../../../common/enums';
import api from '../../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../../Store';

import BasicFormDialog from '../../BasicFormDialog';

export default function UpdatePersonalInfos(props) {
  const { open: openProps, onClose, formik } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const [open, setOpen] = useState(false);

  const updateInfos = async () => {
    const res = await api(`/api/entity/updatePersonInfos`, {
      method: 'PUT',
      body: JSON.stringify({
        entityId: formik.values.person,
        personInfos: {
          birthDate: formik.values.birthDate,
          gender: formik.values.gender,
          address: formik.values.address,
        },
      }),
    });
    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('informations_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
    onClose();
  };

  const buttons = [
    {
      onClick: onClose,
      name: t('no.no'),
      color: 'secondary',
    },
    {
      onClick: updateInfos,
      name: t('yes'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('would_you_like_to_update_info_in_your_profile')}
      fields={[]}
      buttons={buttons}
      onClose={onClose}
    />
  );
}
