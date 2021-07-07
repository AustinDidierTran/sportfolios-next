import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../components/Custom/Button';
import List from '../../../components/Custom/List';
import Paper from '../../../components/Custom/Paper';
import TextField from '../../../components/Custom/TextField';
import ListItem from '@material-ui/core/ListItem';
import styles from './Coupons.module.css';
import api from '../../../actions/api';
import { Store, ACTION_ENUM } from '../../../Store';
import { useFormik } from 'formik';
import CouponFactory from './CouponFactory';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../common/enums';
import { formatRoute } from '../../../utils/stringFormats';

export default function Coupons() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const [items, setItems] = useState(null);
  const [type, setType] = useState('');
  const [open, setOpen] = useState(false);

  const onClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      token: '',
    },
    onSubmit: async (values) => {
      const { token } = values;
      const { data, status } = await api(formatRoute('/api/user/getTokenPromoCode', null, { token }), {
        method: 'GET',
      });
      if (status === REQUEST_STATUS_ENUM.SUCCESS) {
        if (data?.used) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('coupon_already_used'),
            severity: SEVERITY_ENUM.ERROR,
            duration: 4000,
          });
        } else {
          setItems(data);
          setOpen(true);
          setType(data.metadata.type);
        }
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_coupon'),
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      }
    },
  });

  return (
    <Paper>
      <form onSubmit={formik.handleSubmit}>
        <List title={t('coupon_code')} />
        <ListItem className={styles.listItem}>
          <TextField label={t('code')} formik={formik} namespace="token" fullWidth />
          <Button type="submit" color="primary" className={styles.button} style={{ margin: '8px' }}>
            {t('apply')}
          </Button>
        </ListItem>
      </form>
      <CouponFactory type={type} items={items} open={open} onClose={onClose} />
    </Paper>
  );
}
