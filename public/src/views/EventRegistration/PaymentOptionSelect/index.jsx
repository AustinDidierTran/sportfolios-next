import React, { useEffect, useContext } from 'react';
import { RadioGroup } from '../../../components/Custom';
import { useTranslation } from 'react-i18next';
import styles from './PaymentOptionSelect.module.css';
import moment from 'moment';
import { formatPrice } from '../../../utils/stringFormats';
import api from '../../../actions/api';
import { formatRoute } from '../../../utils/stringFormats';
import { Store } from '../../../Store';

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
    const { data } = await api(formatRoute('/api/entity/options', null, { eventId }));
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
      {/* <Typography
        variant="body2"
        color="textSecondary"
        component="p"
        style={{ marginBottom: '8px' }}
      >
        {t('register.registration_can_be_payed_later')}
      </Typography> */}
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
