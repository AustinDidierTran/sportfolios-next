import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../../../../actions/api';
import { PLATEFORM_FEES, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatPrice } from '../../../../utils/stringFormats';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function AddPlayerFee(props) {
  const { onCancel, formik, open: openProps, onClose, onSave, update, } = props;
  const { t } = useTranslation();


  const [allTaxes, setAllTaxes] = useState([]);

  useEffect(() => {
    getTaxes();
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
    if (!formik.values.playerTaxes) {
      formik.setFieldValue('playerTaxes', res[0].value);
    }
  };


  const handleClose = () => {
    update();
    onClose();
  };

  const handleSave = () => {
    onSave(totalPlayer);
  }

  useEffect(() => {
    if(formik.values.playerPrice !== ''){
    formik.setFieldValue('playerPrice', Math.abs(formik.values.playerPrice));
    }
  }, [formik.values.playerPrice]);

  const taxePercentage = useMemo(() => (
    allTaxes.find(x => x.id === formik.values.playerTaxes)?.percentage / 100
  ), [formik.values.playerTaxes]);

  const taxeAmount = useMemo(() => {
    if (formik.values.playerTaxes && formik.values.playerPrice > 0) {
      return formik.values.playerPrice * taxePercentage;
    }
    return '';

  }, [formik.values.playerPrice, formik.values.playerTaxes]);

  const totalPlayer = useMemo(() => {
    if (formik.values.playerTaxes && formik.values.playerPrice > 0) {
      return (formik.values.playerPrice + taxeAmount);
    }
    return '';

  }, [formik.values.playerPrice, formik.values.playerTaxes]);

  const transactionFee = useMemo(() => (
    formik.values.playerPrice * PLATEFORM_FEES
  ), [formik.values.playerPrice]);


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
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'playerTaxes',
      label: t('taxes'),
      options: allTaxes,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: `Coût total avec taxes ${formatPrice(totalPlayer * 100)}`,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: `Frais de transactions ${formatPrice(transactionFee * 100)}`,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: `Montant reçu ${formatPrice(receiveAmout * 100)}`,
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
      name: t('add.add'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={openProps}
      title={t('add.add_player_fees')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
