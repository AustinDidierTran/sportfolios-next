import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useTranslation } from 'react-i18next';
import { formatPrice, formatDate } from '../../../../utils/stringFormats';

import moment from 'moment';

export default function PaymentOptionItem(props) {
  const { t } = useTranslation();
  const { display, value, helperText } = props;
  const format = 'LLL';
  return (
    <ListItem>
      {display ? (
        <>
          {display === t('price') ? (
            <ListItemText style={{ margin: '0px' }} primary={formatPrice(value)} secondary={display} />
          ) : (
            <ListItemText style={{ margin: '0px' }} primary={value} secondary={display} />
          )}
        </>
      ) : (
        <ListItemText
          style={{ margin: '0px' }}
          primary={formatDate(moment.utc(value), format)}
          secondary={helperText}
        />
      )}
    </ListItem>
  );
}
