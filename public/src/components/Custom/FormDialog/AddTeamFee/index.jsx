import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import api from '../../../../actions/api';
import { PLATEFORM_FEES, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { formatPrice } from '../../../../utils/stringFormats';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function AddTeamFee(props) {
  const { onCancel, formik, open: openProps, onSave, onClose, update, edit } = props;
  const { t } = useTranslation();
  const [allTaxes, setAllTaxes] = useState([]);
  const [taxes, setTaxes] = useState([]);

  useEffect(() => {
    if (openProps) {
      getTaxes();
    }
  }, [openProps]);

  useEffect(() => {
    if (formik.values.teamPrice !== '') {
      formik.setFieldValue('teamPrice', Math.abs(formik.values.teamPrice));
    }
  }, [formik.values.teamPrice]);

  const handleChange = (value) => {
    setTaxes(value);
  };

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

  const handleClose = () => {
    update();
    onClose();
  };

  const handleSave = () => {
    formik.setFieldValue('teamTaxes', allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.id));
    onSave(teamTotal);
  }


  const teamTotal = useMemo(() => {
    const formatted = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.percentage);
    return formik.values.teamPrice + (formik.values.teamPrice * (formatted.reduce((prev, curr) => Number(prev) + Number(curr), 0) / 100))

  }, [formik.values.teamPrice, taxes]);


  const transactionFee = useMemo(() => (
    teamTotal * PLATEFORM_FEES
  ), [teamTotal]);


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
      componentType: COMPONENT_TYPE_ENUM.MULTISELECT,
      namespace: 'teamTaxes',
      label: t('taxes'),
      options: allTaxes.map(a => a.display),
      values: taxes,
      onChange: handleChange,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('payment.total_cost_with_taxes', { price: formatPrice(teamTotal * 100) }),
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
      title={edit ? t('edit.edit_team_fees') : t('add.add_team_fees')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
