import React from 'react';

interface Props {
  label: string;
  id: string;
  checked: boolean;
  price: number;
}

const CartItem: React.FunctionComponent<Props> = (props) => {
  return (
    <Item key={props.id}>
      <b>{props.label}</b>
      <Checkbox
        checked={props.checked}
        color="primary"
        onClick={() => updateCartItemSelected(!item.checked, item.id)}
      />
      <span>{formatPrice(props.price)}</span>
    </Item>
  );
};

export default CartItem;
