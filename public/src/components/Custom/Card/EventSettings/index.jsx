import React from 'react';

import Button from '../../Button';
import TextField from '../../TextField';
import Paper from '../../Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { useTranslation } from 'react-i18next';
import styles from './EventSettings.module.css';

export default function EventSettings(props) {
  const { fields, formik } = props;
  const { t } = useTranslation();

  return (
    <Paper className={styles.paper}>
      <form onSubmit={formik.handleSubmit}>
        <List>
          {fields.map((f, index) => (
            <ListItem key={index}>
              <TextField
                namespace={f.namespace}
                fullWidth
                formik={formik}
                label={f.label}
                helperText={f.helperText}
                type={f.type}
              />
            </ListItem>
          ))}
          <Button size="small" variant="contained" endIcon="Check" style={{ marginTop: '8px' }} type="submit">
            {t('save')}
          </Button>
        </List>
      </form>
    </Paper>
  );
}
