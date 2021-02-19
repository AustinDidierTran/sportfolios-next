import React, { useContext, useState } from 'react';

import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CustomAvatar from '../../Avatar';
import CustomCheckBox from '../../CheckBox';
import CustomIconButton from '../../IconButton';
import CustomSelect from '../../Select';
import { useTranslation } from 'react-i18next';
import styles from './CartItem.module.css';
import { formatPrice } from '../../../../utils/stringFormats';
import { GLOBAL_ENUM, IMAGE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import api from '../../../../actions/api';
import AlertDialog from '../../Dialog/AlertDialog';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function CartItem(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const {
    id,
    metadata,
    amount,
    description,
    label,
    photoUrl,
    quantity,
    updateQuantity,
    taxRates,
    checked,
    fetchItems,
  } = props;

  const [disabled, setDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  const quantityOptions = Array(Math.max(101, quantity + 1))
    .fill(0)
    .map((_, index) => ({
      value: index,
      display: index,
    }));

  const handleChange = async () => {
    setDisabled(true);
    const { data } = await api('/api/shop/updateCartItems', {
      method: 'POST',
      body: JSON.stringify({
        selected: !checked,
        cartItemId: id,
      }),
    });
    fetchItems();
    setDisabled(false);
  };

  const onClick = () => {
    setOpen(true);
  };

  const onDelete = async () => {
    const res = await api(
      formatRoute('/api/shop/deleteCartItem', null, {
        cartItemId: id,
      }),
      {
        method: 'DELETE',
      }
    );
    fetchItems();
    setOpen(false);
    if (res.status !== STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  const { type } = metadata;
  if (type === GLOBAL_ENUM.TEAM || type === GLOBAL_ENUM.EVENT) {
    const { team } = metadata;
    if (team) {
      return (
        <>
          <ListItem style={{ width: '100%' }}>
            <div className={styles.div}>
              <ListItemIcon>
                <CustomAvatar
                  photoUrl={photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
                  variant="square"
                  className={styles.photo}
                ></CustomAvatar>
              </ListItemIcon>
              <ListItemText className={styles.name} primary={description} secondary={team.name} />
              <ListItemText
                className={styles.quantity}
                primary={
                  metadata?.isIndividualOption
                    ? taxRates.length
                      ? `${formatPrice(amount)} + ${t('taxes')} | ${metadata?.name}`
                      : `${formatPrice(amount)}| ${metadata?.name}`
                    : taxRates.length
                    ? `${formatPrice(amount)} + ${t('taxes')}`
                    : `${formatPrice(amount)}`
                }
                secondary={label}
              />
              <CustomCheckBox disabled={disabled} checked={checked} onChange={handleChange} style={{ margin: '0px' }} />
              <CustomIconButton
                variant="contained"
                onClick={onClick}
                icon="Delete"
                tooltip={t('delete.delete')}
                style={{ color: 'primary' }}
              ></CustomIconButton>
            </div>
          </ListItem>
          <Divider />
          <AlertDialog
            open={open}
            onCancel={() => {
              setOpen(false);
            }}
            title={t('delete.delete_cart_item_confirmation')}
            onSubmit={onDelete}
          />
        </>
      );
    }
    const { person } = metadata;
    if (person) {
      return (
        <>
          <ListItem style={{ width: '100%' }}>
            <div className={styles.div}>
              <ListItemIcon>
                <CustomAvatar
                  photoUrl={photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
                  variant="square"
                  className={styles.photo}
                ></CustomAvatar>
              </ListItemIcon>
              <ListItemText className={styles.name} primary={description} secondary={person.complete_name} />
              <ListItemText
                className={styles.quantity}
                primary={
                  metadata?.isIndividualOption
                    ? taxRates.length
                      ? `${formatPrice(amount)} + ${t('taxes')} | ${metadata?.name}`
                      : `${formatPrice(amount)}| ${metadata?.name}`
                    : taxRates.length
                    ? `${formatPrice(amount)} + ${t('taxes')}`
                    : `${formatPrice(amount)}`
                }
                secondary={label}
              />
              <CustomCheckBox disabled={disabled} checked={checked} onChange={handleChange} style={{ margin: '0px' }} />
              <CustomIconButton
                variant="contained"
                onClick={onClick}
                icon="Delete"
                tooltip={t('delete.delete')}
                style={{ color: 'primary' }}
              ></CustomIconButton>
            </div>
          </ListItem>
          <Divider />
          <AlertDialog
            open={open}
            onCancel={() => {
              setOpen(false);
            }}
            title={t('delete.delete_cart_item_confirmation')}
            onSubmit={onDelete}
          />
        </>
      );
    }
  }
  if (type === GLOBAL_ENUM.MEMBERSHIP) {
    const { person, organization } = metadata;
    return (
      <>
        <ListItem style={{ width: '100%' }}>
          <div className={styles.div}>
            <ListItemIcon>
              <CustomAvatar
                photoUrl={organization?.photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
                variant="square"
                className={styles.photo}
              ></CustomAvatar>
            </ListItemIcon>
            <ListItemText className={styles.name} primary={t(label)} secondary={organization?.name}></ListItemText>
            <ListItemText
              className={styles.quantity}
              primary={taxRates.length ? `${formatPrice(amount)} + ${t('taxes')}` : formatPrice(amount)}
              secondary={`${person?.name} ${person?.surname}`}
            ></ListItemText>
            <CustomCheckBox disabled={disabled} checked={checked} onChange={handleChange} style={{ margin: '0px' }} />
            <CustomIconButton
              variant="contained"
              onClick={onClick}
              icon="Delete"
              tooltip={t('delete.delete')}
              style={{ color: 'primary' }}
            ></CustomIconButton>
          </div>
        </ListItem>
        <Divider />
        <AlertDialog
          open={open}
          onCancel={() => {
            setOpen(false);
          }}
          title={t('delete.delete_cart_item_confirmation')}
          onSubmit={onDelete}
        />
      </>
    );
  }
  if (type === GLOBAL_ENUM.SHOP_ITEM) {
    const { size } = metadata;
    return (
      <>
        <ListItem style={{ width: '100%' }}>
          <div className={styles.div}>
            <ListItemIcon>
              <CustomAvatar photoUrl={photoUrl} variant="square" className={styles.photo}></CustomAvatar>
            </ListItemIcon>
            <ListItemText className={styles.name} primary={label} secondary={t(size) || ''}></ListItemText>
            <ListItemText
              className={styles.quantity}
              primary={taxRates.length ? `${formatPrice(amount)} + ${t('taxes')}` : formatPrice(amount)}
              secondary={`Qt: ${quantity}`}
            ></ListItemText>
            <CustomCheckBox disabled={disabled} checked={checked} onChange={handleChange} />
            <CustomSelect
              className={styles.select}
              onChange={(value) => {
                updateQuantity(value, id);
              }}
              value={quantity}
              options={quantityOptions}
              label={t('quantity')}
            />
          </div>
        </ListItem>
        <Divider />
      </>
    );
  }
  return <></>;
}
