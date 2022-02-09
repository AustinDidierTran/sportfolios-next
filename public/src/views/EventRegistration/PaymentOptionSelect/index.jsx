import React, { useEffect, useContext, useMemo } from 'react';
import { RadioGroup } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './PaymentOptionSelect.module.css';
import moment from 'moment';
import { formatPrice } from '../../../utils/stringFormats';
import api from '../../../actions/api';
import { formatRoute } from '../../../utils/stringFormats';
import { Store } from '../../../Store';
import { Typography } from '@material-ui/core';
import WarningIcon from '@material-ui/icons/Warning';

export default function PaymentOptionSelect(props) {
  const { t } = useTranslation();
  const { stepHook, formik } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);

  useEffect(() => {
    if (eventId) {
      getOptions();
    }
  }, [eventId]);

  const onChange = (e, value) => {
    formik.setFieldValue('paymentOption', value);
    stepHook.handleCompleted(0);
  };

  const getOptions = async () => {
    const { data } = await api(formatRoute('/api/entity/options', null, { eventId }), { method: 'GET' });
    const options = data
      .filter((d) => moment(d.startTime) <= moment() && moment(d.endTime) >= moment())
      .reduce(
        (prev, d) => [
          ...prev,
          {
            display: `${d.name} | ${getPaymentOptionDisplay(d)}`,
            value: d.id,
            secondary: d.teamActivity ? t('team.team_activity') : t('individual_activity'),
            teamActivity: d.teamActivity,
            informations: d.informations,
          },
        ],
        []
      );
    formik.setFieldValue('paymentOptions', options);
  };

  const hasTeamActivity = useMemo(() => {
    return formik.values.paymentOptions.some((option) => option.teamActivity);
  });

  const getPaymentOptionDisplay = (option) => {
    if (option.teamPrice === 0 && option.individualPrice === 0) {
      return t('free');
    } else if (option.teamPrice === 0 && option.individualPrice !== 0) {
      return `${formatPrice(option.individualPrice)} (${t('per_player')})`;
    } else if (option.teamPrice !== 0 && option.individualPrice === 0) {
      return `${formatPrice(option.teamPrice)} (${t('team.team')})`;
    } else {
      return `${formatPrice(option.teamPrice)} (${t('team.team')}) ${t('and_lowerCased')} ${formatPrice(
        option.individualPrice
      )} (${t('per_player')})`;
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.header}>
        {hasTeamActivity ? (
          <>
            <WarningIcon className={styles.warning} fontSize="large" />
            <Typography variant="body2" color="textSecondary" align="center" className={styles.typography}>
              {t('captain_only_warning')}
            </Typography>
          </>
        ) : null}
      </div>
      <RadioGroup
        namespace="paymentOptions"
        options={formik.values.paymentOptions}
        title={t('payment.payment_options')}
        onChange={onChange}
        value={formik.values.paymentOption}
        className={styles.radio}
      />
    </div>
  );
}
