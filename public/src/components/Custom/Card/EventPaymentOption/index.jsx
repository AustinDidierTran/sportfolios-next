import React from 'react';

import CustomButton from '../../Button';
import CustomList from '../../List';
import CustomPaper from '../../Paper';
import { useTranslation } from 'react-i18next';
import { LIST_ITEM_ENUM } from '../../../../../../common/enums';
import styles from './EventPaymentOption.module.css';

export default function EventPaymentOption(props) {
  const { option, fields, onDelete } = props;
  const { t } = useTranslation();

  const paymentOptionId = option[4];

  const arr = fields.filter((f) => f.type != 'time');
  const items = arr.map((f, index) => ({
    display: f.display,
    value: option[index],
    helperText: f.helperText,
    type: LIST_ITEM_ENUM.PAYMENT_OPTION,
    key: index,
  }));

  return (
    <CustomPaper>
      <div>
        <CustomList items={items} />
        <CustomButton
          size="small"
          variant="contained"
          color="secondary"
          endIcon="Delete"
          onClick={() => {
            onDelete(paymentOptionId);
          }}
          className={styles.button}
        >
          {t('delete.delete')}
        </CustomButton>
      </div>
    </CustomPaper>
  );
}
