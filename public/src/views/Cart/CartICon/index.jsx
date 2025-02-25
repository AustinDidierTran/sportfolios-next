import React, { useContext } from 'react';
import IconButton from '../../../components/Custom/IconButton';
import { goTo, ROUTES } from '../../../actions/goTo';
import { Store } from '../../../Store';
import Badge from '@material-ui/core/Badge';

export default function CartIcon() {
  const {
    state: {
      cart: { items },
    },
  } = useContext(Store);

  const total = Array.isArray(items) ? items.reduce((prev, item) => prev + item.quantity, 0) : null;

  return (
    <Badge badgeContent={total} color="error">
      <IconButton color="inherit" icon="ShoppingCartOutlined" onClick={() => goTo(ROUTES.cart)} />
    </Badge>
  );
}
