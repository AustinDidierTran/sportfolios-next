import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import { formatDate } from '../../../utils/stringFormats';
import moment from 'moment';

import { useTranslation } from 'react-i18next';

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

export default function CouponRow(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { coupon } = props;

  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
      maxWidth: '100%',
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  return (
    <>
      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          {coupon.email}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {coupon.token_id}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {coupon.used == true ? (
            <div className={classes.root}>
              <Chip label={t('used')} color="primary" variant="outlined" />
            </div>
          ) : (
            <div className={classes.root}>
              <Chip label={t('not_used')} color="secondary" variant="outlined" />
            </div>
          )}
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {formatDate(moment.parseZone(coupon.expires_at))}
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
