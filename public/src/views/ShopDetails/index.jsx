import React, { useContext, useMemo, useState, useEffect } from 'react';

import styles from './ShopDetails.module.css';
import { useTranslation } from 'react-i18next';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import api from '../../actions/api';
import { goTo, ROUTES, goToAndReplace } from '../../actions/goTo';
import Button from '../../components/Custom/Button';
import Paper from '../../components/Custom/Paper';
import IgContainer from '../../components/Custom/IgContainer';
import Select from '../../components/Custom/Select';
import { formatPrice } from '../../utils/stringFormats';
import { useFormik } from 'formik';
import Typography from '@material-ui/core/Typography';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Store, ACTION_ENUM } from '../../Store';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../common/enums';
import { useRouter } from 'next/router';
import { formatRoute } from '../../utils/stringFormats';
import CustomIconButton from '../../components/Custom/IconButton';

export default function ShopDetails() {
  const {
    state: { isAuthenticated, id },
    dispatch,
  } = useContext(Store);
  const { t } = useTranslation();
  const router = useRouter();
  const { stripePriceId } = router.query;
  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { label: name, amount: price, photoUrl, metadata, description } = item;

  const text = useMemo(() => decodeURIComponent(description), [description]);
  const fetchItem = async () => {
    const { data } = await api(formatRoute('/api/shop/getItem', null, { id: stripePriceId }), { method: 'GET' });
    setItem(data);

    setIsLoading(false);
  };

  const validate = (values) => {
    const errors = {};
    const { quantity } = values;

    if (quantity < 1) {
      errors.quantity = t('quantity_cant_be_null');
    }
  };

  const formik = useFormik({
    initialValues: {
      quantity: 1,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (!isAuthenticated) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('you.you_need_to_create_an_account'),
          severity: SEVERITY_ENUM.INFO,
        });
        goToAndReplace(ROUTES.login, null, {
          redirectUrl: formatRoute(ROUTES.shopDetails, {
            id,
            stripePriceId,
          }),
        });
        return;
      }

      const { quantity, size } = values;
      const metadata = {};

      if (size) {
        metadata.size = size;
      }

      /* eslint-disable-next-line */
      const res = await api('/api/shop/addCartItem', {
        method: 'POST',
        body: JSON.stringify({
          stripePriceId,
          metadata,
          quantity,
        }),
      });

      if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
        goTo(ROUTES.productAddedToCart, null, {
          amount: quantity,
          name: item.label,
          total: formatPrice(quantity * item.amount),
          id,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          severity: SEVERITY_ENUM.ERROR,
          message: t('something_went_wrong'),
        });
      }
    },
  });

  const goBack = () => {
    history.back();
  };

  const sizeOptions = useMemo(() => {
    if (metadata && metadata.sizes) {
      const sizes = JSON.parse(metadata.sizes);
      formik.setFieldValue('size', sizes[0]);
      return sizes.map((size) => ({
        value: size,
        display: t(`sizes_enum_${size.toLowerCase()}`),
      }));
    }

    return null;
  }, [metadata]);

  useEffect(() => {
    if (stripePriceId && id) {
      fetchItem();
    }
  }, [stripePriceId, id]);

  const quantityOptions = Array(100)
    .fill(0)
    .map((a, index) => ({
      value: index + 1,
      display: index + 1,
    }));

  if (isLoading) {
    return <CircularProgress />;
  }

  if (!item) {
    // TODO: Return 404 view
    return null;
  }

  return (
    <IgContainer>
      <form onSubmit={formik.handleSubmit}>
        <Paper>
          <div className={styles.button}>
            <CustomIconButton
              size="medium"
              icon="ArrowBack"
              tooltip={t('back')}
              style={{ color: 'primary' }}
              onClick={goBack}
            />
          </div>
          <CardMedia className={styles.media} image={photoUrl} />
          <CardContent className={styles.infos}>
            <Typography gutterBottom variant="h5" className={styles.name}>
              {name}
            </Typography>
            <Typography variant="h6" className={styles.price}>
              {formatPrice(price)}
            </Typography>
            <TextareaAutosize className={styles.description} placeholder={t('description.description')} value={text} disabled />
            {sizeOptions.length > 0 ? (
              <div className={styles.sizes}>
                <Select label={t('size')} formik={formik} namespace="size" options={sizeOptions} />
              </div>
            ) : null}
            <div className={styles.quantity}>
              <Select label={t('quantity')} formik={formik} namespace="quantity" options={quantityOptions} />
            </div>
            <Button type="submit" size="small" color="primary" endIcon="AddShoppingCart" className={styles.cart}>
              {t('add.add_to_cart')}
            </Button>
          </CardContent>
        </Paper>
      </form>
    </IgContainer>
  );
}
