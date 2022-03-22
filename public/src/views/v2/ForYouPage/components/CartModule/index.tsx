import ShoppingCart from '@material-ui/icons/ShoppingCart';
import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';
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

const CartModule: React.FunctionComponent<Record<string, unknown>> = () => {
  const {
    state: {
      cart: { items },
    },
  } = useContext(Store);

  const count = useMemo(() => items.length, [items.length]);

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
