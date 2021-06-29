import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import AttachMoney from '@material-ui/icons/AttachMoney';
import { useTranslation } from 'react-i18next';
import { INVOICE_STATUS_ENUM, STATUS_ENUM } from '../../../../common/enums';

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

interface IProps {
  status: string;
  onClick?: () => void;
  clickable?: boolean;
}

const StatusChip: React.FunctionComponent<IProps> = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const { status, onClick, clickable = true } = props;

  if (status === STATUS_ENUM.PENDING) {
    return (
      <div className={classes.root}>
        <Chip
          onClick={onClick}
          label={t(status)}
          style={{ border: '1px solid #dddd00', color: '#dddd00 ' }}
          variant="outlined"
          clickable={clickable}
        />
      </div>
    );
  }
  if (status === STATUS_ENUM.REFUSED) {
    return (
      <div className={classes.root}>
        <Chip onClick={onClick} label={t(status)} color="secondary" variant="outlined" clickable={clickable} />
      </div>
    );
  }
  if (status === INVOICE_STATUS_ENUM.PAID || status === INVOICE_STATUS_ENUM.FREE) {
    return (
      <div className={classes.root}>
        <Chip label={t(status)} icon={<AttachMoney />} color="primary" variant="outlined" clickable={clickable} />
      </div>
    );
  }

  if (status === INVOICE_STATUS_ENUM.REFUNDED) {
    return (
      <div className={classes.root}>
        <Chip label={t('refunded')} icon={<AttachMoney />} color="secondary" variant="outlined" clickable={clickable} />
      </div>
    );
  }
  return null;
};
export default StatusChip;
