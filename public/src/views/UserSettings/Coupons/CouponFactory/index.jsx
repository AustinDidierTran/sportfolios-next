import React from 'react';
import { COUPON_CODE_ENUM } from '../../../../../common/enums';

import dynamic from 'next/dynamic';

const BecomeMemberCoupon = dynamic(() => import('./BecomeMemberCoupon'));

const couponMap = {
  [COUPON_CODE_ENUM.BECOME_MEMBER]: BecomeMemberCoupon,
};

export default function CouponFactory(props) {
  const { items, open, onClose, type } = props;
  const Coupon = couponMap[type];
  if (!Coupon) {
    return null;
  }
  return <Coupon items={items} open={open} onClose={onClose} />;
}
