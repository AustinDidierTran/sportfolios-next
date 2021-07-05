import React, { useState, useMemo, useEffect, useContext } from 'react';
import styles from './Cart.module.css';
import api from '../../actions/api';
import { goTo, ROUTES } from '../../actions/goTo';
import { CARD_TYPE_ENUM, LIST_ITEM_ENUM, SEVERITY_ENUM, NUMBER_STATUS_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import { formatPageTitle } from '../../utils/stringFormats';
import Button from '../../components/Custom/Button';
import MessageAndButtons from '../../components/Custom/MessageAndButtons';
import List from '../../components/Custom/List';
import ContainerBottomFixed from '../../components/Custom/ContainerBottomFixed';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import Card from '../../components/Custom/Card';
import AlertDialog from '../../components/Custom/Dialog/AlertDialog';
import { Store, ACTION_ENUM } from '../../Store';
import { ERROR_ENUM } from '../../../common/errors';

const getCartItems = async () => {
  const { data: cartItems } = await api('/api/shop/getCartItems');
  return cartItems;
};

export default function Cart() {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = formatPageTitle(t('cart'));
  }, []);

  const fetchItems = async () => {
    const data = await getCartItems();
    const { items: itemsProp, total: totalProp } = data;
    setItems(itemsProp);
    setTotal(totalProp);
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: data,
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const disabled = useMemo(() => {
    if (total.total <= 0) {
      return true;
    }
    return false;
  }, [total]);

  const updateQuantity = async (quantity, cartItemId) => {
    const { data } = await api('/api/shop/updateCartItems', {
      method: 'POST',
      body: JSON.stringify({
        quantity,
        cartItemId,
      }),
    });
    const { items: itemsProp, total: totalProp } = data;
    setItems(itemsProp);
    setTotal(totalProp);
    dispatch({
      type: ACTION_ENUM.UPDATE_CART,
      payload: data,
    });
  };

  const onDelete = async () => {
    const res = await api('/api/shop/deleteAllCartItems', {
      method: 'DELETE',
    });
    fetchItems();
    setOpen(false);

    if (res.status > NUMBER_STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (items.length < 1) {
    const buttons = [
      {
        name: t('home'),
        onClick: () => {
          goTo(ROUTES.home);
        },
        endIcon: 'Home',
        color: 'primary',
      },
    ];
    return <MessageAndButtons buttons={buttons} message={t('cart_empty_go_shop')} withoutIgContainer />;
  }
  return (
    <>
      <div className={styles.cart}>
        <List
          items={items.map((item, index) => ({
            ...item,
            checked: item.selected,
            updateQuantity,
            fetchItems,
            type: LIST_ITEM_ENUM.CART,
            key: index,
          }))}
        />
        <Card
          items={{
            items,
            total,
          }}
          type={CARD_TYPE_ENUM.CART_SUMMARY}
        />
        <Button
          size="small"
          variant="contained"
          endIcon="Delete"
          onClick={() => {
            setOpen(true);
          }}
          className={styles.delete}
          color="secondary"
        >
          {t('clear_cart')}
        </Button>
      </div>
      <ContainerBottomFixed>
        <div className={styles.buttonDiv}>
          <Button
            size="small"
            variant="contained"
            endIcon="Check"
            onClick={() => {
              goTo(ROUTES.checkout);
            }}
            style={{ margin: 8 }}
            className={styles.button}
            disabled={disabled}
          >
            {t('checkout')}
          </Button>
        </div>
      </ContainerBottomFixed>
      <AlertDialog
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        onSubmit={onDelete}
        title={t('clear_cart_confirmation')}
      />
    </>
  );
}
