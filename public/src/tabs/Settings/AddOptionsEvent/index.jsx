import React, { useEffect, useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import styles from './AddOptionsEvent.module.css';
import { SEVERITY_ENUM, STATUS_ENUM, FORM_DIALOG_TYPE_ENUM } from '../../../../common/enums';
import { Store, ACTION_ENUM } from '../../../Store';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../common/utils/stringFormat';
import CustomPaper from '../../../components/Custom/Paper';
import CustomButton from '../../../components/Custom/Button';
import CustomLoadingSpinner from '../../../components/Custom/LoadingSpinner';
import EventPaymentOptionList from './EventPaymentOptionList';
import CustomFormDialog from '../../../components/Custom/FormDialog';

export default function AddOptionsEvent() {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [options, setOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getOptions();
  }, [eventId]);

  const getOptions = async () => {
    const { data } = await api(formatRoute('/api/entity/options', null, { eventId }));
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
      name,
      teamPrice,
      playerPrice,
      ownerId,
      taxRatesId,
      openDate,
      openTime,
      closeDate,
      closeTime,
      teamActivity,
    } = values;

    const formattedTeamPrice = Math.floor(Number(teamPrice) * 100);
    const formattedPlayerPrice = Math.floor(Number(playerPrice) * 100);
    const start = new Date(`${openDate} ${openTime}`).getTime();
    const end = new Date(`${closeDate} ${closeTime}`).getTime();

    setIsLoading(true);
    const res = await api(`/api/entity/option`, {
      method: 'POST',
      body: JSON.stringify({
        eventId,
        name,
        ownerId,
        taxRatesId,
        teamPrice: formattedTeamPrice,
        playerPrice: formattedPlayerPrice,
        startTime: start,
        endTime: end,
        teamActivity,
      }),
    });
    if (res.status === STATUS_ENUM.ERROR) {
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
      <CustomPaper title={t('payment_options')}>
        <CustomLoadingSpinner isComponent />
      </CustomPaper>
    );
  }

  return (
    <CustomPaper title={t('payment_options')}>
      <CustomButton className={styles.addButton} color="primary" onClick={() => setOpen(true)}>
        {t('add_payment_option')}
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
