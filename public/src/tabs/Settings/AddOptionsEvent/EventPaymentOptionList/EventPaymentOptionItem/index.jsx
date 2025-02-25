import React, { useState, useContext, useMemo } from 'react';

import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import CollapsePaymentOption from './CollapsePaymentOption';
import AlertDialog from '../../../../../components/Custom/Dialog/AlertDialog';
import CustomIconButton from '../../../../../components/Custom/IconButton';
import { formatRoute } from '../../../../../utils/stringFormats';
import { ACTION_ENUM, Store } from '../../../../../Store';
import api from '../../../../../actions/api';
import { FORM_DIALOG_TYPE_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../../common/enums';
import { formatDate, formatPrice } from '../../../../../utils/stringFormats';
import CustomFormDialog from '../../../../../components/Custom/FormDialog';
import { COLORS } from '../../../../../utils/colors';

export default function EventPaymentOptionItem(props) {
  const { t } = useTranslation();
  const { option, update } = props;
  const { id, name, teamPrice, individualPrice, startTime, endTime } = option;

  const { dispatch } = useContext(Store);
  const [alertDialog, setAlertDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  const onDelete = async () => {
    await api(formatRoute('/api/entity/option', null, { id }), { method: 'DELETE' });
    update();
    setAlertDialog(false);
  };

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const editOptionEvent = async (values) => {
    const { openDate, openTime, closeDate, closeTime } = values;

    const timeZone = new Date().getTimezoneOffset() * 1000 * 60;
    const start = new Date(`${openDate} ${openTime}`).getTime() - timeZone;
    const end = new Date(`${closeDate} ${closeTime}`).getTime() - timeZone;

    const res = await api('/api/entity/updateOption', {
      method: 'PUT',
      body: JSON.stringify({
        id,
        startTime: start,
        endTime: end,
      }),
    });

    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('changes_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    }
    update();
  };

  return (
    <div>
      <ListItem onClick={handleExpand}>
        <ListItemText
          primary={`${name} | ${t('price_team')} ${teamPrice === 0 ? t('free') : formatPrice(teamPrice)}, ${t(
            'price_individual'
          )} ${individualPrice === 0 ? t('free') : formatPrice(individualPrice)}`}
          secondary={t('open_from_to', {
            startDate: formatDate(moment.utc(startTime), 'MMM D'),
            endDate: formatDate(moment.utc(endTime), 'MMM D'),
          })}
        />
        <CustomIconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: COLORS.grey }} />
      </ListItem>
      <CollapsePaymentOption option={option} expanded={expanded} setEdit={setEdit} setAlertDialog={setAlertDialog} />
      <Divider />
      <CustomFormDialog
        type={FORM_DIALOG_TYPE_ENUM.EDIT_EVENT_PAYMENT_OPTION}
        items={{
          open: edit,
          onClose: () => {
            setEdit(false);
          },
          option,
          editOptionEvent,
        }}
      />
      <AlertDialog
        open={alertDialog}
        onSubmit={onDelete}
        onCancel={() => setAlertDialog(false)}
        description={t('payment.delete_payment_option_confirmation')}
        title={t('payment.delete_payment_option')}
      />
    </div>
  );
}
