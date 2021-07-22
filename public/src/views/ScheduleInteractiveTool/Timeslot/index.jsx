import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import FormDialog from '../../../components/Custom/FormDialog';
import styles from './Timeslot.module.css';
import Typography from '@material-ui/core/Typography';
import IconButton from '../../../components/Custom/IconButton';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';
import { ACTION_ENUM, Store } from '../../../Store';
import { SEVERITY_ENUM } from '../../../../common/enums';
import { formatDate } from '../../../utils/stringFormats';
import moment from 'moment';

export default function Timeslot(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { timeslot, games } = props;

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const formik = useFormik({
    initialValues: {
      time: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { time } = values;
      console.log('changetime', time);
    },
  });

  const onOpenDelete = () => {
    if (
      games.some((game) => {
        return game.timeslotId === timeslot.id;
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
    console.log('deleteField', timeslot);
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
      namespace: 'time',
      id: 'timeslot',
      type: 'text',
      label: t('timeslot'),
    },
  ];

  return (
    <div className={styles.divTime}>
      <Typography className={styles.label}>{formatDate(moment.utc(timeslot.date), 'DD MMM HH:mm')}</Typography>
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
        title={t('delete.delete_timeslot_confirmation')}
        onSubmit={() => {
          setOpenDelete(false);
          onDeleteConfirmed();
        }}
      />
      <FormDialog
        open={open}
        title={t('edit.edit_timeslot')}
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
