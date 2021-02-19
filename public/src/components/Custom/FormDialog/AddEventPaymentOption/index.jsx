import React, { useContext, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import moment from 'moment';
import BasicFormDialog from '../BasicFormDialog';
import { FIELD_GROUP_ENUM, SEVERITY_ENUM } from '../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../Store';
import api from '../../../../actions/api';
import { useFields } from '../../../../hooks/fields';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../../../common/utils/stringFormat';
import * as yup from 'yup';

export default function AddEventPaymentOption(props) {
  const { open, onClose, addOptionToEvent } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const [ownersId, setOwnersId] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [allTaxes, setAllTaxes] = useState([]);
  const [teamActivity, setTeamActivity] = useState(true);
  const [teamAcceptation, setTeamAcceptation] = useState(false);
  const [playerAcceptation, setPlayerAcceptation] = useState(false);
  const router = useRouter();

  const { id: eventId } = router.query;

  const getAccounts = async () => {
    const { data } = await api(formatRoute('/api/stripe/eventAccounts', null, { eventId }));
    const res = data.map((r) => ({
      value: r.id,
      display: `${r?.name} ${r?.surname}`,
      key: r.id,
    }));
    setOwnersId(res);
    if (res[0]) {
      formik.setFieldValue('ownerId', res[0].value);
    }
  };

  const getTaxes = async () => {
    const { data } = await api(formatRoute('/api/stripe/getTaxes'));
    const res = data.map((d) => ({
      id: d.id,
      percentage: d.percentage,
      display: `${d.display_name} ${d.percentage} %`,
    }));
    setAllTaxes(res);
  };

  const handleChange = (value) => {
    setTaxes(value);
  };

  useEffect(() => {
    getAccounts();
    getTaxes();
  }, [open]);

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    teamPrice: teamActivity
      ? yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED))
      : yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)),
    playerPrice: yup.number().min(0, t(ERROR_ENUM.VALUE_IS_INVALID)).required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    openDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    closeDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    openTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    closeTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const validate = (values) => {
    const { teamPrice, playerPrice, ownerId, openDate, openTime, closeDate, closeTime } = values;
    const errors = {};

    if (teamPrice > 0 && !ownerId) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_bank_account_linked'),
        severity: SEVERITY_ENUM.ERROR,
      });
      errors.teamPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
    }

    if (playerPrice > 0 && !ownerId) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_bank_account_linked'),
        severity: SEVERITY_ENUM.ERROR,
      });
      errors.playerPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (closeDate < openDate) {
      errors.closeDate = t(ERROR_ENUM.CLOSE_AFTER_OPEN);
    }
    if (closeDate === openDate && closeTime < openTime) {
      errors.closeTime = t(ERROR_ENUM.CLOSE_AFTER_OPEN);
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      name: '',
      teamPrice: '',
      playerPrice: '',
      ownerId: ``,
      openDate: moment().format('YYYY-MM-DD'),
      openTime: '00:00',
      closeDate: moment().add(1, 'month').format('YYYY-MM-DD'),
      closeTime: '23:59',
    },
    validationSchema: validationSchema,
    validate,
    validateOnChange: false,
    onSubmit: (values) => {
      let teamAcc = teamAcceptation;
      const taxRatesId = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.id);
      if (!teamActivity) {
        values.teamPrice = 0;
        teamAcc = false;
      }
      addOptionToEvent({ ...values, taxRatesId, teamActivity, teamAcceptation: teamAcc, playerAcceptation });
      onClose();
    },
  });

  const onChange = (value) => {
    setTeamActivity(value);
  };
  const onTeamChange = (value) => {
    setTeamAcceptation(value);
  };
  const onPlayerChange = (value) => {
    setPlayerAcceptation(value);
  };

  const getPriceWithTax = (amount, taxes) => {
    return Math.ceil(
      taxes.reduce((prev, curr) => {
        return prev + prev * (curr / 100);
      }, amount)
    );
  };

  const teamPriceTotal = useMemo(() => {
    const formatted = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.percentage);
    return getPriceWithTax(formik.values.teamPrice * 100, formatted) / 100;
  }, [formik.values.teamPrice, taxes]);

  const playerPriceTotal = useMemo(() => {
    const formatted = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.percentage);

    return getPriceWithTax(formik.values.playerPrice * 100, formatted) / 100;
  }, [formik.values.playerPrice, taxes]);

  const fields = useFields(FIELD_GROUP_ENUM.ADD_PAYMENT_OPTION, {
    allTaxes,
    handleChange,
    onChange,
    onPlayerChange,
    onTeamChange,
    ownersId,
    playerAcceptation,
    playerPriceTotal,
    taxes,
    teamAcceptation,
    teamActivity,
    teamPriceTotal,
  });
  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add.add'),
      color: 'primary',
    },
  ];
  return (
    <BasicFormDialog
      open={open}
      title={t('payment.payment_option')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
      dialogContentStyle={{ paddingTop: '0px' }}
    />
  );
}
