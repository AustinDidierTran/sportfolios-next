import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';
import { STATUS_ENUM } from '../../../../../../common/enums';
import styles from './StatusChip.module.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function StatusChip(props) {
  const classes = useStyles();
  const { t } = useTranslation();

  const { registrationStatus } = props;

  if (registrationStatus === STATUS_ENUM.PENDING) {
    return (
      <div className={classes.root}>
        <Chip label={t(registrationStatus)} className={styles.chip} variant="outlined" />
      </div>
    );
  }
  if (registrationStatus === STATUS_ENUM.REFUSED) {
    return (
      <div className={classes.root}>
        <Chip label={t(registrationStatus)} color="secondary" variant="outlined" />
      </div>
    );
  }
}
