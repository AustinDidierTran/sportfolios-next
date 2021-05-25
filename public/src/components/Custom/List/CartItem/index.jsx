import React, { useContext, useState } from 'react';

import { formatRoute } from '../../../../utils/stringFormats';
import { GLOBAL_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import api from '../../../../actions/api';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import { formatRoute } from '../../../../../common/utils/stringFormat';
import TeamItem from './TeamItem';
import PersonItem from './PersonItem';
import DonationItem from './DonationItem';
import MembershipItem from './MembershipItem';
import ShopItem from './ShopItem';

export default function CartItem(props) {
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
    if (res.status > STATUS_ENUM.SUCCESS) {
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
        ></TeamItem>
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
        ></PersonItem>
      );
    }
  }
  if (type === GLOBAL_ENUM.MEMBERSHIP) {
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
      ></MembershipItem>
    );
  }
  if (type === GLOBAL_ENUM.SHOP_ITEM) {
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
      ></ShopItem>
    );
  }
  if (type === GLOBAL_ENUM.DONATION) {
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
      ></DonationItem>
    );
  }
  return <></>;
}
