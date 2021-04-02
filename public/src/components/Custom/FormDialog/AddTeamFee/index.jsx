import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../../../../actions/api';
import { PLATEFORM_FEES, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatPrice } from '../../../../utils/stringFormats';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function AddTeamFee(props) {
  const { onCancel, formik, open: openProps, onSave, onClose, update } = props;
  const { t } = useTranslation();
  const [allTaxes, setAllTaxes] = useState([]);

  useEffect(() => {
    getTaxes();
  }, [openProps]);

    useEffect(() => {
    if(formik.values.teamPrice !== ''){
    formik.setFieldValue('teamPrice', Math.abs(formik.values.teamPrice));
    }
  }, [formik.values.teamPrice]);

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
    if (!formik.values.teamTaxes) {
      formik.setFieldValue('teamTaxes', res[0].value);
    }
  };

  const handleClose = () => {
    update();
    onClose();
  };

  const handleSave = () => {
    onSave(teamTotal);
  }


  const taxePercentage = useMemo(() => (
    allTaxes.find(x => x.id === formik.values.teamTaxes)?.percentage / 100
  ), [formik.values.teamTaxes]);

  const taxeAmount = useMemo(() => {
    if (formik.values.teamTaxes && formik.values.teamPrice > 0) {
      return formik.values.teamPrice * taxePercentage;
    }
    return '';

  }, [formik.values.teamPrice, formik.values.teamTaxes]);

  const teamTotal = useMemo(() => {
    if (formik.values.teamTaxes && formik.values.teamPrice > 0) {
      return (formik.values.teamPrice + taxeAmount);
    }
    return '';

  }, [formik.values.teamPrice, formik.values.teamTaxes]);

  const transactionFee = useMemo(() => (
    formik.values.teamPrice * PLATEFORM_FEES
  ), [formik.values.teamPrice]);


  const receiveAmout = useMemo(() => (
    teamTotal - transactionFee
  ), [teamTotal, transactionFee]);

  const fields = [
    {
      namespace: 'teamPrice',
      label: t('price_team'),
      type: 'number',
      endAdorment: '$',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'teamTaxes',
      label: t('taxes'),
      options: allTaxes,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: `Coût total avec taxes: ${formatPrice(teamTotal * 100)}`,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: `Frais de transactions: ${formatPrice(transactionFee * 100)}`,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: `Montant reçu: ${formatPrice(receiveAmout * 100)}`,
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
      title={t('add.add_team_fees')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
