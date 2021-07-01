import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, NUMBER_STATUS_ENUM } from '../../../../../common/enums';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  update?: any;
}

const AddTeam: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { isOpen, onClose, update } = props;
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validate = (values: { name: string }): { name?: string } => {
    const { name } = values;
    const errors: { name?: string } = {};
    if (!name.length) {
      errors.name = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (name.length > 64) {
      formik.setFieldValue('name', name.slice(0, 64));
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validate,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { name } = values;

      const { status, data } = await api('/api/entity/addTeamAsAdmin', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          name,
        }),
      });
      onClose();
      resetForm();
      if (status === NUMBER_STATUS_ENUM.ERROR) {
        if (data.reason) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t(data.reason),
            severity: SEVERITY_ENUM.ERROR,
            duration: 4000,
          });
        } else {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: ERROR_ENUM.ERROR_OCCURED,
            severity: SEVERITY_ENUM.ERROR,
            duration: 4000,
          });
        }
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('team.team_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
      }
      update();
    },
  });

  const buttons = [
    {
      onClick: onFinish,
      name: t('finish'),
      color: 'grey',
    },
    {
      type: 'submit',
      name: t('add.add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'name',
      id: 'name',
      type: 'text',
      label: t('name'),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('add.add_team')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
};
export default AddTeam;
