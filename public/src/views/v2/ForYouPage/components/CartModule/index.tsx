import ShoppingCart from '@material-ui/icons/ShoppingCart';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
import { CartItemBuyer, CartItemSeller } from '../../../../../../../typescript/cart';
import { goTo, ROUTES } from '../../../../../actions/goTo';
import { Store } from '../../../../../Store';
import Badge from '../Badge';

const Container = styled.div`
  position: fixed;
  right: 1.5rem;
  bottom: 7rem;

  @media (min-width: ${(props) => props.theme.breakpoints.container}) {
    right: calc((100vw - 700px) / 2 + 1.5rem);
  }
`;

const Circle = styled.div`
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  background-color: white;
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    color: ${(props) => props.theme.primary.main};
  }
`;

const CartModule: React.FunctionComponent = () => {
  const {
    state: { cart },
  } = useContext(Store);

  const count = useMemo(() => {
    if (!cart.buyers) {
      return 0;
    }

    return cart.buyers.reduce(
      (prevBuyer: number, buyer: CartItemBuyer) =>
        buyer.sellers.reduce((prevSeller: number, seller: CartItemSeller) => seller.items.length + prevSeller, 0) +
        prevBuyer,
      0
    );
  }, [cart]);

  return (
    <Container>
      <Badge
        count={count}
        position="right"
        onClick={() => {
          goTo(ROUTES.cart);
        }}
      >
        <Circle>
          <ShoppingCart />
        </Circle>
      </Badge>
    </Container>
  );
};

export default CartModule;
