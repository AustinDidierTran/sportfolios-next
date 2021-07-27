import React from 'react';

import { unregister } from '../../../actions/api/helpers';
import { useTranslation } from 'react-i18next';
import CustomIconButton from '../IconButton';
import { COLORS } from '../../../utils/colors';

export default function UnregisterButton(props) {
  const { t } = useTranslation();
  const { eventId, rosterId } = props;

  const onClick = () => {
    unregister({ eventId, rosterId });
  };

  return (
    <CustomIconButton
      color="primary"
      variant="contained"
      icon="MoneyOff"
      tooltip={t('refund')}
      onClick={onClick}
      style={{ color: COLORS.turquoise }}
    />
  );
}
