import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Chip from '@material-ui/core/Chip';
import { useTranslation } from 'react-i18next';

export default function CouponRowMobile(props) {
  const { coupon } = props;
  const { t } = useTranslation();

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
            <div>
              <Chip label={t('used')} color="primary" variant="outlined" />
            </div>
          ) : (
            <div>
              <Chip label={t('not_used')} color="secondary" variant="outlined" />
            </div>
          )}
        </StyledTableCell>
      </StyledTableRow>
    </>
  );
}
