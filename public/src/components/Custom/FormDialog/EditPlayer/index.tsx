import React, { useContext, useEffect, useState } from 'react';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, ROSTER_ROLE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import api from '../../../../actions/api';
import BasicFormDialog from '../BasicFormDialog';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import { Player } from '../../../../../../typescript/types';
import { updatePlayer } from '../../../../actions/service/entity';

interface IProps {
  open: boolean;
  onClose: () => void;
  update: () => void;
  player: Player;
}

const EditPlayer: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { open: openProps, onClose, player, update } = props;
  const [open, setOpen] = useState<boolean>(false);

  const { dispatch } = useContext(Store);

  useEffect(() => {
    setOpen(openProps);
    formik.setFieldValue('role', player.role);
  }, [openProps]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      role: '',
    },
    onSubmit: async (values) => {
      const { role } = values;
      const status = await updatePlayer(player.id, role);
      if (status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        handleClose();
      }
      update();
    },
  });

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'role',
      label: formik.values.role === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN ? t('assistant_captain') : t('role'),
      options: [
        {
          display: t('coach'),
          value: ROSTER_ROLE_ENUM.COACH,
        },
        {
          display: t('captain'),
          value: ROSTER_ROLE_ENUM.CAPTAIN,
        },
        {
          display: t('assistant_captain'),
          value: ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN,
        },
        {
          display: t('player'),
          value: ROSTER_ROLE_ENUM.PLAYER,
        },
      ],
    },
  ];

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('edit.edit'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('edit.edit_player')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
};
export default EditPlayer;
