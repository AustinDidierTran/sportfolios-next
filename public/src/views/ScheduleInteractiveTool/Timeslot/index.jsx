import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import FormDialog from '../../../components/Custom/FormDialog';
import styles from './Timeslot.module.css';
import Typography from '@material-ui/core/Typography';
import IconButton from '../../../components/Custom/IconButton';
import AlertDialog from '../../../components/Custom/Dialog/AlertDialog';
import { ACTION_ENUM, Store } from '../../../Store';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { formatDate } from '../../../utils/stringFormats';
import { COLORS } from '../../../utils/colors';
import moment from 'moment';
import { ERROR_ENUM } from '../../../../common/errors';
import { updateTimeslot } from '../../../actions/service/entity/put';
import { deleteTimeslot } from '../../../actions/service/entity/delete';
import * as yup from 'yup';

export default function Timeslot(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { timeslot, games, update } = props;

  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const validationSchema = yup.object().shape({
    time: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    date: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      time: moment.utc(timeslot.date).format('HH:mm'),
      date: moment.utc(timeslot.date).format('YYYY-MM-DD'),
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { date, time } = values;
      const timeZone = new Date(`${date} ${time}`).getTimezoneOffset() * 1000 * 60;
      const realDate = new Date(`${date} ${time}`).getTime() - timeZone;
      const status = await updateTimeslot(timeslot.id, realDate);
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
    if (games.some((game) => game.timeslotId === timeslot.id)) {
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
    const status = await deleteTimeslot(timeslot.id);
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
      namespace: 'date',
      id: 'date',
      type: 'date',
    },
    {
      namespace: 'time',
      id: 'time',
      type: 'time',
    },
  ];

  return (
    <div className={styles.divTime}>
      <Typography className={styles.label}>{formatDate(moment.utc(timeslot.date), 'DD MMM HH:mm')}</Typography>
      <IconButton style={{ color: COLORS.grey }} icon="Edit" onClick={() => setOpen(true)} className={styles.hide} />
      <IconButton style={{ color: COLORS.grey }} icon="Delete" onClick={onOpenDelete} className={styles.hide} />
      <AlertDialog
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
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
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
