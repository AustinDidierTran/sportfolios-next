import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  REQUEST_STATUS_ENUM,
  COMPONENT_TYPE_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  MEMBERSHIP_LENGTH_TYPE_ENUM,
  MEMBERSHIP_LENGTH_ENUM,
  MIN_AMOUNT_FEES,
  PLATEFORM_FEES_PERCENTAGE,
  PLATEFORM_FEES_FIX,
} from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { validateDate, formatPrice, formatRoute } from '../../../../utils/stringFormats';
import { uploadFile } from '../../../../actions/aws';
import { hasStripeBankAccount } from '../../../../actions/service/stripe';

export default function AddMembership(props) {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  const [open, setOpen] = useState(false);
  const [fixedDate, setFixedDate] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [allTaxes, setAllTaxes] = useState([]);
  const [file, setFile] = useState(null);
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    if (entityId) {
      getTaxes();
    }
    setOpen(openProps);
    formik.setFieldValue('membership', MEMBERSHIP_TYPE_ENUM.RECREATIONAL);
    formik.setFieldValue('type', MEMBERSHIP_LENGTH_TYPE_ENUM.LENGTH);
    formik.setFieldValue('date', '01/01');
    formik.setFieldValue('length', MEMBERSHIP_LENGTH_ENUM.ONE_YEAR);
  }, [openProps, entityId]);

  const handleClose = () => {
    setFile(null);
    setTerms(false);
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

  const validate = async (values) => {
    const { price, date, type } = values;
    const errors = {};
    if (!price && price !== 0) {
      errors.price = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (price < 0) {
      errors.price = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (price > 0 && !(await hasStripeBankAccount(entityId))) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_bank_account_linked'),
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
      description: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { membership, date, type, length, price, description } = values;
      let fileUrl = null;

      if (file && file.type.split('/')[1] === 'pdf') {
        fileUrl = await uploadFile(file);
        if (!fileUrl) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('invalid.invalid_file'),
            severity: SEVERITY_ENUM.ERROR,
          });
          return;
        }
      }

      const correctPrice = Math.floor(price * 100);
      const taxRatesId = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.id);

      let desc = description;
      if (!description) {
        desc = null;
      }

      const res = await api(`/api/entity/membership`, {
        method: 'POST',
        body: JSON.stringify({
          entityId,
          membership,
          length,
          date,
          type,
          description: desc,
          fileName: file?.name,
          fileUrl,
          price: correctPrice,
          taxRatesId,
        }),
      });

      if (res.status === REQUEST_STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('member.membership_added'),
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

  const total = useMemo(() => {
    const formatted = allTaxes.filter((t) => taxes.includes(t.display)).map((t) => t.percentage);
    if (!formik.values.price) {
      return 0;
    }
    return (
      formik.values.price +
      formik.values.price * (formatted.reduce((prev, curr) => Number(prev) + Number(curr), 0) / 100)
    );
  }, [formik.values.price, taxes]);
  const transactionFee = useMemo(
    () => (total >= MIN_AMOUNT_FEES ? total * PLATEFORM_FEES_PERCENTAGE + PLATEFORM_FEES_FIX : 0),
    [total]
  );
  const receiveAmout = useMemo(() => {
    if (!total) {
      return 0;
    }
    return total - transactionFee;
  }, [total, transactionFee]);

  const uploadProps = {
    multiple: false,
    accept: '.pdf',
    onStart(file) {
      // Show preview
      if (file.type.split('/')[1] === 'pdf') {
        setFile(file);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_format_pdf'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const termsField = terms
    ? [
        {
          componentType: COMPONENT_TYPE_ENUM.BUTTON,
          onClick: () => {
            setTerms(false);
            setFile(null);
            formik.setFieldValue('description', '');
          },
          children: t('remove_terms_and_conditions'),
          color: 'secondary',
        },
        {
          componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
          primary: t('terms_and_conditions'),
          secondary: t('terms_and_conditions_description'),
        },
        {
          componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
          namespace: 'description',
          label: t('description.description_optional'),
          variant: 'filled',
          rows: 5,
          rowsMax: 15,
          style: { width: '100%' },
        },
        file
          ? {
              componentType: COMPONENT_TYPE_ENUM.LIST,
              icon: 'Delete',
              primary: file?.name,
              onIconClick: () => {
                setFile(null);
              },
              tooltip: t('delete.delete'),
            }
          : {
              componentType: COMPONENT_TYPE_ENUM.FILE_UPLOAD,
              props: uploadProps,
              buttonName: t('upload_terms_and_conditions'),
            },
      ]
    : [
        {
          componentType: COMPONENT_TYPE_ENUM.BUTTON,
          onClick: () => {
            setTerms(true);
          },
          children: t('add.add_terms_and_conditions'),
        },
      ];

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'membership',
      label: t('member.membership'),
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
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('payment.total_cost_with_taxes', { price: formatPrice(total * 100) }),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('payment.transaction_fees_with_fees', { fee: formatPrice(transactionFee * 100) }),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.LIST_ITEM,
      primary: t('payment.received_amount_with_amount', { amount: formatPrice(receiveAmout * 100) }),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.DIVIDER,
    },
    ...termsField,
  ];

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
      title={t('add.add_membership')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
