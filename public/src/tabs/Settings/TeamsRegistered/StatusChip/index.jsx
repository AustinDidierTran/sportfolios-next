import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import AttachMoney from '@material-ui/icons/AttachMoney';
import { INVOICE_STATUS_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { useTranslation } from 'react-i18next';
import { ROUTES, goTo } from '../../../../actions/goTo';

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

  const { status, registrationStatus, eventId, rosterId } = props;

  if (registrationStatus === STATUS_ENUM.PENDING) {
    return (
      <div className={classes.root}>
        <Chip
          onClick={() => {
            goTo(ROUTES.teamsAcceptation, { id: eventId }, { rosterId });
          }}
          label={t(registrationStatus)}
          style={{ border: '1px solid #CCCC00', color: '#CCCC00 ' }}
          variant="outlined"
        />
      </div>
    );
  }
  if (registrationStatus === STATUS_ENUM.REFUSED) {
    return (
      <div className={classes.root}>
        <Chip
          onClick={() => {
            goTo(ROUTES.teamsAcceptation, { id: eventId }, { rosterId });
          }}
          label={t(registrationStatus)}
          color="secondary"
          variant="outlined"
        />
      </div>
    );
  }
  if (status === INVOICE_STATUS_ENUM.PAID || status === INVOICE_STATUS_ENUM.FREE) {
    return (
      <div className={classes.root}>
        <Chip label={t(`payment.${status}`)} icon={<AttachMoney />} color="primary" variant="outlined" />
      </div>
    );
  }

  if (status === INVOICE_STATUS_ENUM.REFUNDED) {
    return (
      <div className={classes.root}>
        <Chip label={t('payment.refunded')} icon={<AttachMoney />} color="secondary" variant="outlined" />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Chip label={t('payment.not_paid')} icon={<AttachMoney />} color="secondary" variant="outlined" />
    </div>
  );
}
