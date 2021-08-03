import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import styles from './AddOptionsEvent.module.css';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM, FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import { Store, ACTION_ENUM } from '../../../Store';
import { formatRoute } from '../../../utils/stringFormats';
import dynamic from 'next/dynamic';
import EventPaymentOptionList from './EventPaymentOptionList';
import { goTo, ROUTES } from '../../../actions/goTo';

const CustomPaper = dynamic(() => import('../../../components/Custom/Paper'));
const CustomButton = dynamic(() => import('../../../components/Custom/Button'));
const CustomLoadingSpinner = dynamic(() => import('../../../components/Custom/LoadingSpinner'));
const CustomFormDialog = dynamic(() => import('../../../components/Custom/FormDialog'));

export default function AddOptionsEvent() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      getOptions();
    }
  }, [eventId]);

  const getOptions = async () => {
    const { data } = await api(formatRoute('/api/entity/options', null, { eventId }), { method: 'GET' });
    const dataOptions = data.map((o) => ({
      option: o,
      update: getOptions,
      key: o.id,
    }));
    setOptions(dataOptions);
  };

  const onClose = () => {
    setOpen(false);
  };

  const addOptionToEvent = async (values) => {
    const {
      closeDate,
      closeTime,
      name,
      openDate,
      openTime,
      ownerId,
      playerAcceptation,
      playerPrice,
      taxRatesId,
      teamAcceptation,
      teamActivity,
      teamPrice,
      informations,
    } = values;

    const formattedTeamPrice = Math.floor(Number(teamPrice) * 100);
    const formattedPlayerPrice = Math.floor(Number(playerPrice) * 100);
    const timeZone = new Date().getTimezoneOffset() * 1000 * 60;
    const start = new Date(`${openDate} ${openTime}`).getTime() - timeZone;
    const end = new Date(`${closeDate} ${closeTime}`).getTime() - timeZone;

    let infos = informations;
    if (!informations.length) {
      infos = null;
    }

    setIsLoading(true);
    const res = await api(`/api/entity/option`, {
      method: 'POST',
      body: JSON.stringify({
        endTime: end,
        eventId,
        name,
        ownerId,
        playerAcceptation,
        playerPrice: formattedPlayerPrice,
        startTime: start,
        taxRatesId,
        teamAcceptation,
        teamActivity,
        teamPrice: formattedTeamPrice,
        informations: infos,
      }),
    });
    if (res.status === REQUEST_STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
      setIsLoading(false);
      return;
    }
    getOptions();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <CustomPaper title={t('payment.payment_options')}>
        <CustomLoadingSpinner isComponent />
      </CustomPaper>
    );
  }

  return (
    <CustomPaper title={t('payment.payment_options')}>
      <CustomButton
        className={styles.addButton}
        color="primary"
        onClick={() => goTo(ROUTES.optionPayment, { id: eventId })}
      >
        {t('payment.add_payment_option')}
      </CustomButton>
      <EventPaymentOptionList items={options} />
      <CustomFormDialog
        type={FORM_DIALOG_TYPE_ENUM.ADD_EVENT_PAYMENT_OPTION}
        items={{
          open,
          onClose,
          addOptionToEvent,
        }}
      />
    </CustomPaper>
  );
}
