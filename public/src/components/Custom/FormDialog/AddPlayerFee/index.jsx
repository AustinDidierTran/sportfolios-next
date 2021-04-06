import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../../../../actions/api';
import { PLATEFORM_FEES, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatPrice } from '../../../../utils/stringFormats';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function AddPlayerFee(props) {
  const { onCancel, formik, open: openProps, onClose, onSave, update, edit } = props;
  const { t } = useTranslation();

  const [allTaxes, setAllTaxes] = useState([]);
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    if (openProps) {
      getTaxes();
    }
  }, [openProps]);

  const getTaxes = async () => {
    const { data } = await api(formatRoute('/api/stripe/getTaxes'));

    if (!data) {
      return;
    }

    const res = data.map((d) => ({
      id: d.id,
      percentage: d.percentage,
      display: `${d.display_name} ${d.percentage} %`,
      value: d.id,
    }));
    setAllTaxes(res);

    if (!edit) {
      setTaxes([]);
    }
  };

  const handleChange = (value) => {
    setTaxes(value);
  };

  const handleClose = () => {
    update();
    onClose();
  };

  const handleSave = () => {
    formik.setFieldValue('playerTaxes', allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.id));
    onSave(totalPlayer);
  }

  useEffect(() => {
    if (formik.values.playerPrice !== '') {
      formik.setFieldValue('playerPrice', Math.abs(formik.values.playerPrice));
    }
  }, [formik.values.playerPrice]);

  const totalPlayer = useMemo(() => {
    const formatted = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.percentage);
    return formik.values.playerPrice + (formik.values.playerPrice * (formatted.reduce((prev, curr) => Number(prev) + Number(curr), 0) / 100))

  }, [formik.values.playerPrice, taxes]);

  const transactionFee = useMemo(() => (
    totalPlayer * PLATEFORM_FEES
  ), [totalPlayer]);


  const receiveAmout = useMemo(() => (
    totalPlayer - transactionFee
  ), [totalPlayer, transactionFee]);

  const fields = [
    {
      namespace: 'playerPrice',
      label: t('price_player'),
      type: 'number',
      endAdorment: '$',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.MULTISELECT,
      namespace: 'playerTaxes',
      label: t('taxes'),
      options: allTaxes.map(a => a.display),
      values: taxes,
      onChange: handleChange,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('payment.total_cost_with_taxes', { price: formatPrice(totalPlayer * 100) }),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('payment.transaction_fees', { fee: formatPrice(transactionFee * 100) }),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('payment.received_amount', { amount: formatPrice(receiveAmout * 100) }),
    },

  ];

  const buttons = [
    {
      onClick: onCancel,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: handleSave,
      name: edit ? t('edit.edit') : t('add.add'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={openProps}
      title={edit ? t('edit.edit_player_fees') : t('add.add_player_fees')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
