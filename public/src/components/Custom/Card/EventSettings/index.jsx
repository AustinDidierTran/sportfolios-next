import React from 'react';

import Button from '../../Button';
import TextField from '../../TextField';
import Paper from '../../Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useTranslation } from 'react-i18next';
import styles from './EventSettings.module.css';

export default function EventSettings(props) {
  const { formik } = props;
  const { t } = useTranslation();

  return (
    <Paper className={styles.paper}>
      <form onSubmit={formik.handleSubmit}>
        <List>
          <ListItem>
            <TextField namespace="maximumSpots" fullWidth formik={formik} label={t('maximum_spots')} type="number" />
          </ListItem>
          <ListItem>
            <TextField
              className={styles.date}
              namespace="startDate"
              fullWidth
              formik={formik}
              helperText={t('event.event_start_date')}
              type="date"
            />
            <TextField
              className={styles.time}
              namespace="startTime"
              fullWidth
              formik={formik}
              helperText={t('event.event_start_time')}
              type="time"
            />
          </ListItem>
          <ListItem>
            <TextField
              className={styles.date}
              namespace="endDate"
              fullWidth
              formik={formik}
              helperText={t('event.event_end_date')}
              type="date"
            />
            <TextField
              className={styles.time}
              namespace="endTime"
              fullWidth
              formik={formik}
              helperText={t('event.event_end_time')}
              type="time"
            />
          </ListItem>
          <Button size="small" variant="contained" endIcon="Check" style={{ marginTop: '8px' }} type="submit">
            {t('save')}
          </Button>
        </List>
      </form>
    </Paper>
  );
}
