import React, { useState, useContext, useEffect } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import FormDialog from '../../../components/Custom/FormDialog';
import styles from './Field.module.css';
import Typography from '@material-ui/core/Typography';
import IconButton from '../../../components/Custom/IconButton';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';
import { ACTION_ENUM, Store } from '../../../Store';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { updateField } from '../../../actions/service/entity/put';
import { deleteField } from '../../../actions/service/entity/delete';
import { ERROR_ENUM } from '../../../../common/errors';
import { COLORS } from '../../../utils/colors';
import * as yup from 'yup';

export default function Field(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { field, games, update } = props;

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (field.field) {
      formik.setFieldValue('name', field.field);
    }
  }, [field.field]);

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { name } = values;
      const status = await updateField(field.id, name);
      if (status === REQUEST_STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        update();
        setOpen(close);
      }
    },
  });

  const onOpenDelete = () => {
    if (games.some((game) => game.fieldId === field.id)) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_delete_field'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      setOpenDelete(true);
    }
  };

  const onDeleteConfirmed = async () => {
    const status = await deleteField(field.id);
    if (status === REQUEST_STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else {
      setOpenDelete(false);
      update();
    }
  };

  const buttons = [
    {
      onClick: () => {
        setOpen(false);
      },
      name: t('finish'),
      color: 'default',
    },
    {
      type: 'submit',
      name: t('edit.edit'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      namespace: 'name',
      id: 'field',
      type: 'text',
      label: t('field'),
    },
  ];

  return (
    <div className={styles.divField}>
      <Typography className={styles.label}>{field.field}</Typography>
      <IconButton style={{ color: COLORS.grey }} icon="Edit" onClick={() => setOpen(true)} className={styles.hide} />
      <IconButton style={{ color: COLORS.grey }} icon="Delete" onClick={onOpenDelete} className={styles.hide} />
      <AlertDialog
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        title={t('delete.delete_field_confirmation')}
        onSubmit={() => {
          setOpenDelete(false);
          onDeleteConfirmed();
        }}
      />
      <FormDialog
        open={open}
        title={t('edit.edit_field')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
