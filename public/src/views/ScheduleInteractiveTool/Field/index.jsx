import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import FormDialog from '../../../components/Custom/FormDialog';
import styles from './Field.module.css';
import Typography from '@material-ui/core/Typography';
import IconButton from '../../../components/Custom/IconButton';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';
import { ACTION_ENUM, Store } from '../../../Store';
import { SEVERITY_ENUM } from '../../../../common/enums';

export default function Field(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { field, games } = props;

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { name } = values;
      console.log('changeName', name);
    },
  });

  const onOpenDelete = () => {
    if (
      games.some((game) => {
        return game.fieldId === field.id;
      })
    ) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_delete_field'),
        severity: SEVERITY_ENUM.ERROR,
      });
    } else {
      setOpenDelete(true);
    }
  };

  const onDeleteConfirmed = () => {
    console.log('deleteField', field);
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
      name: t('add.add'),
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
      <IconButton
        style={{ color: 'grey' }}
        icon="Edit"
        onClick={() => {
          setOpen(true);
        }}
        className={styles.hide}
      />
      <IconButton style={{ color: 'grey' }} icon="Delete" onClick={onOpenDelete} className={styles.hide} />
      <AlertDialog
        open={openDelete}
        onCancel={() => {
          setOpenDelete(false);
        }}
        title={t('delete.delete_field_confirmation')}
        onSubmit={() => {
          setOpenDelete(false);
          onDeleteConfirmed();
        }}
      />
      <FormDialog
        open={open}
        title={t('add.add_field')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={() => {
          setOpen(false);
        }}
      />
    </div>
  );
}
