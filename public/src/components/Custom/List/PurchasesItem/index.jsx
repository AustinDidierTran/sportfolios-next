import React from 'react';

import { GLOBAL_ENUM } from '../../../../../common/enums';
import PersonItem from './PersonItem';
import ShopItem from './ShopItem';
import TeamItem from './TeamItem';
import MembershipItem from './MembershipItem';
import DonationItem from './DonationItem';

export default function PurchasesItem(props) {
  const {
    photoUrl,
    created_at: createdAt,
    label,
    amount,
    metadata,
    quantity,
    description,
    receipt_url: receiptUrl,
  } = props;
  const goToReceipt = () => {
    window.open(receiptUrl);
  };
  const { type } = metadata;
  if (type === GLOBAL_ENUM.EVENT) {
    const { team, person } = metadata;
    if (team) {
      return (
        <TeamItem
          photoUrl={photoUrl}
          description={description}
          metadata={metadata}
          teamName={team.name}
          createdAt={createdAt}
          amount={amount}
          label={label}
          goToReceipt={goToReceipt}
        />
      );
    }
    if (person) {
      return (
        <PersonItem
          photoUrl={photoUrl}
          description={description}
          metadata={metadata}
          personName={person.complete_name}
          createdAt={createdAt}
          amount={amount}
          label={label}
          goToReceipt={goToReceipt}
        />
      );
    }
    return null;
  }
  if (type === GLOBAL_ENUM.MEMBERSHIP) {
    const { organization, person } = metadata;
    return (
      <MembershipItem
        organization={organization}
        person={person}
        metadata={metadata}
        createdAt={createdAt}
        amount={amount}
        label={label}
        goToReceipt={goToReceipt}
      />
    );
  }

  if (type === GLOBAL_ENUM.SHOP_ITEM) {
    const { size } = metadata;
    return (
      <ShopItem
        photoUrl={photoUrl}
        size={size}
        quantity={quantity}
        createdAt={createdAt}
        amount={amount}
        label={label}
        goToReceipt={goToReceipt}
      />
    );
  }

  if (type === GLOBAL_ENUM.DONATION) {
    const { person, organization } = metadata;
    return (
      <DonationItem
        organization={organization}
        person={person}
        metadata={metadata}
        createdAt={createdAt}
        amount={amount}
        label={label}
        goToReceipt={goToReceipt}
      />
    );
  }
  return null;
}
