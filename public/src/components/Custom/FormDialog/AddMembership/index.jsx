import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  STATUS_ENUM,
  COMPONENT_TYPE_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  MEMBERSHIP_LENGTH_TYPE_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
} from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { validateDate } from '../../../../utils/stringFormats';
import { formatRoute } from '../../../../actions/goTo';
import { useRouter } from 'next/router';

export default function AddMembership(props) {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: entityId } = router.query;

  const [open, setOpen] = useState(false);
  const [fixedDate, setFixedDate] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [allTaxes, setAllTaxes] = useState([]);

  useEffect(() => {
    getTaxes();
    setOpen(openProps);
    formik.setFieldValue('membership', MEMBERSHIP_TYPE_ENUM.RECREATIONAL);
    formik.setFieldValue('type', MEMBERSHIP_LENGTH_TYPE_ENUM.LENGTH);
    formik.setFieldValue('date', '01/01');
    formik.setFieldValue('length', MEMBERSHIP_LENGTH_ENUM.ONE_YEAR);
  }, [openProps]);

  const handleClose = () => {
    formik.resetForm();
    update();
    onClose();
  };

  const handleChange = (value) => {
    setTaxes(value);
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

  const hasBankAccount = async () => {
    const { data: hasStripeBankAccount } = await api(
      formatRoute('/api/stripe/hasStripeBankAccount', null, {
        entityId,
      })
    );
    return hasStripeBankAccount;
  };

  const validate = async (values) => {
    const { price, date, type } = values;
    const errors = {};
    if (!price && price !== 0) {
      errors.price = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (price < 0) {
      errors.price = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (price > 0 && !(await hasBankAccount())) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no_bank_account_linked'),
        severity: SEVERITY_ENUM.ERROR,
      });
      errors.price = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (type === MEMBERSHIP_LENGTH_TYPE_ENUM.FIXED) {
      if (!date) {
        errors.date = t(ERROR_ENUM.VALUE_IS_REQUIRED);
      } else if (!validateDate(date)) {
        errors.date = t(ERROR_ENUM.VALUE_IS_INVALID);
      }
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      membership: '',
      type: '',
      date: '',
      length: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { membership, date, type, length, price } = values;
      const correctPrice = Math.floor(price * 100);
      const taxRatesId = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.id);

      const res = await api(`/api/entity/membership`, {
        method: 'POST',
        body: JSON.stringify({
          entityId,
          membership,
          length,
          date,
          type,
          price: correctPrice,
          taxRatesId,
        }),
      });

      if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('membership_added'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        handleClose();
      }
    },
  });

  useEffect(() => {
    if (formik.values.type === MEMBERSHIP_LENGTH_TYPE_ENUM.FIXED) {
      setFixedDate(true);
    } else {
      setFixedDate(false);
    }
  }, [formik.values.type]);

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'membership',
      label: t('membership'),
      options: [
        {
          display: t('recreational'),
          value: MEMBERSHIP_TYPE_ENUM.RECREATIONAL,
        },
        {
          display: t('competitive'),
          value: MEMBERSHIP_TYPE_ENUM.COMPETITIVE,
        },
        {
          display: t('elite'),
          value: MEMBERSHIP_TYPE_ENUM.ELITE,
        },
        {
          display: t('junior'),
          value: MEMBERSHIP_TYPE_ENUM.JUNIOR,
        },
      ],
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'type',
      label: t('type'),
      options: [
        {
          display: t('length'),
          value: MEMBERSHIP_LENGTH_TYPE_ENUM.LENGTH,
        },
        {
          display: t('fixed_date'),
          value: MEMBERSHIP_LENGTH_TYPE_ENUM.FIXED,
        },
      ],
    },
    fixedDate
      ? {
          namespace: 'date',
          label: 'MM/DD',
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.SELECT,
          namespace: 'length',
          label: t('length'),
          options: [
            {
              display: t('one_month'),
              value: MEMBERSHIP_LENGTH_ENUM.ONE_MONTH,
            },
            {
              display: t('six_month'),
              value: MEMBERSHIP_LENGTH_ENUM.SIX_MONTH,
            },
            {
              display: t('one_year'),
              value: MEMBERSHIP_LENGTH_ENUM.ONE_YEAR,
            },
          ],
        },
    {
      display: t('price'),
      type: 'number',
      namespace: 'price',
      label: t('price'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.MULTISELECT,
      namespace: 'taxes',
      label: t('taxes'),
      options: allTaxes.map((a) => a.display),
      values: taxes,
      onChange: handleChange,
    },
  ];

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  return (
    <BasicFormDialog
      open={open}
      title={t('add_membership')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
