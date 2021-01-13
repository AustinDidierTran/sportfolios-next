import React, { useState } from 'react';

import { Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Avatar, Select, CheckBox } from '../../../Custom';
import { useTranslation } from 'react-i18next';
import styles from './CartItem.module.css';
import { formatPrice } from '../../../../utils/stringFormats';
import { GLOBAL_ENUM, IMAGE_ENUM } from '../../../../../common/enums';
import api from '../../../../actions/api';
import { AlertDialog } from '../../Dialog';
import { formatRoute } from '../../../../actions/goTo';

export default function CartItem(props) {
  const { t } = useTranslation();

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
    await api(
      formatRoute('/api/shop/deleteCartItem', null, {
        cartItemId: id,
      }),
      {
        method: 'DELETE',
      }
    );
    fetchItems();

    setOpen(false);
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
                <Avatar
                  photoUrl={photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
                  variant="square"
                  className={styles.photo}
                ></Avatar>
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
              <CheckBox disabled={disabled} checked={checked} onChange={handleChange} />
            </div>
          </ListItem>
          <Divider />
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
                <Avatar
                  photoUrl={photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
                  variant="square"
                  className={styles.photo}
                ></Avatar>
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
              <CheckBox disabled={disabled} checked={checked} onChange={handleChange} />
            </div>
          </ListItem>
          <Divider />
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
              <Avatar
                photoUrl={organization?.photoUrl || IMAGE_ENUM.ULTIMATE_TOURNAMENT}
                variant="square"
                className={styles.photo}
              ></Avatar>
            </ListItemIcon>
            <ListItemText className={styles.name} primary={t(label)} secondary={organization?.name}></ListItemText>
            <ListItemText
              className={styles.quantity}
              primary={taxRates.length ? `${formatPrice(amount)} + ${t('taxes')}` : formatPrice(amount)}
              secondary={`${person?.name} ${person?.surname}`}
            ></ListItemText>
            <CheckBox disabled={disabled} checked={checked} onChange={handleChange} />
          </div>
        </ListItem>
        <Divider />
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
              <Avatar photoUrl={photoUrl} variant="square" className={styles.photo}></Avatar>
            </ListItemIcon>
            <ListItemText className={styles.name} primary={label} secondary={t(size) || ''}></ListItemText>
            <ListItemText
              className={styles.quantity}
              primary={taxRates.length ? `${formatPrice(amount)} + ${t('taxes')}` : formatPrice(amount)}
              secondary={`Qt: ${quantity}`}
            ></ListItemText>
            <CheckBox disabled={disabled} checked={checked} onChange={handleChange} />
            <Select
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
