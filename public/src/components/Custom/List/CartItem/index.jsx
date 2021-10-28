import React, { useContext, useState } from 'react';

import { formatRoute } from '../../../../utils/stringFormats';
import { GLOBAL_ENUM, CART_ITEM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import api from '../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import TeamItem from './TeamItem';
import PersonItem from './PersonItem';
import DonationItem from './DonationItem';
import MembershipItem from './MembershipItem';
import ShopItem from './ShopItem';
import TicketItem from './TicketItem';
import { useTranslation } from 'react-i18next';

export default function CartItem(props) {
  const { dispatch } = useContext(Store);
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
  const [open, setOpen] = useState(false);

  const quantityOptions = Array(Math.max(101, quantity + 1))
    .fill(0)
    .map((_, index) => ({
      value: index,
      display: index === 0 ? t('cart.remove_item') : index,
    }));

  const handleChange = async () => {
    setDisabled(true);
    await api('/api/shop/updateCartItems', {
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
    const res = await api(formatRoute('/api/shop/deleteCartItem', null, { cartItemId: id }), { method: 'DELETE' });
    fetchItems();
    setOpen(false);
    if (res.status != REQUEST_STATUS_ENUM.SUCCESS) {
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
        <TeamItem
          photoUrl={photoUrl}
          description={description}
          metadata={metadata}
          teamName={team.name}
          taxLength={taxRates.length}
          amount={amount}
          label={label}
          onDelete={onDelete}
          onClick={onClick}
          handleChange={handleChange}
          disabled={disabled}
          checked={checked}
          open={open}
          setOpen={setOpen}
        />
      );
    }
    const { person } = metadata;
    if (person) {
      return (
        <PersonItem
          photoUrl={photoUrl}
          description={description}
          metadata={metadata}
          personName={person.complete_name}
          taxLength={taxRates.length}
          amount={amount}
          label={label}
          onDelete={onDelete}
          onClick={onClick}
          handleChange={handleChange}
          disabled={disabled}
          checked={checked}
          open={open}
          setOpen={setOpen}
        />
      );
    }
  }
  if (type === CART_ITEM.MEMBERSHIP) {
    const { person, organization } = metadata;
    return (
      <MembershipItem
        organization={organization}
        person={person}
        taxLength={taxRates.length}
        amount={amount}
        label={label}
        onDelete={onDelete}
        onClick={onClick}
        handleChange={handleChange}
        disabled={disabled}
        checked={checked}
        open={open}
        setOpen={setOpen}
      />
    );
  }
  if (type === CART_ITEM.SHOP_ITEM) {
    const { size } = metadata;
    return (
      <ShopItem
        photoUrl={photoUrl}
        size={size}
        taxLength={taxRates.length}
        quantity={quantity}
        quantityOptions={quantityOptions}
        updateQuantity={updateQuantity}
        amount={amount}
        label={label}
        handleChange={handleChange}
        disabled={disabled}
        checked={checked}
        id={id}
      />
    );
  }
  if (type === CART_ITEM.DONATION) {
    const { person, organization, note } = metadata;
    return (
      <DonationItem
        organization={organization}
        person={person}
        taxLength={taxRates.length}
        note={note}
        amount={amount}
        label={label}
        onDelete={onDelete}
        onClick={onClick}
        handleChange={handleChange}
        disabled={disabled}
        checked={checked}
        open={open}
        setOpen={setOpen}
      />
    );
  }
  if (type === CART_ITEM.EVENT_TICKET) {
    return (
      <TicketItem
        photoUrl={metadata.photoUrl}
        eventName={metadata.name}
        taxLength={taxRates.length}
        quantity={quantity}
        quantityOptions={quantityOptions}
        updateQuantity={updateQuantity}
        amount={amount}
        label={label}
        handleChange={handleChange}
        disabled={disabled}
        checked={checked}
        id={id}
      />
    );
  }
  return null;
}
