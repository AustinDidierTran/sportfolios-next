import { KeyboardArrowLeft } from '@material-ui/icons';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CartItem, CartItemBuyer, CartItemSeller, TaxRate } from '../../../../../typescript/cart';
import { Person } from '../../../../../typescript/entity';
import { ROUTES_ENUM } from '../../../../common/enums';
import { goTo } from '../../../actions/goTo';
import { Store } from '../../../Store';
import { formatPrice } from '../../../utils/stringFormats';
import MainContainer from '../common/MainLayout/Container';
import MainContent from '../common/MainLayout/Content';

import MainHeader from '../common/MainLayout/Header';
import Badge from '../ForYouPage/components/Badge';
import Total from './component/Total';

const Title = styled.h1`
  font-size: 1.75rem;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 1rem;
  width: 100%;
  gap: 1.25rem;

  & > div {
    flex: 40%;
  }
`;

const PersonDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  & > b {
    margin-top: 0.5rem;
    margin-bottom: 0.25rem;
  }
  & > img,
  & > div {
    aspect-ratio: 1 / 1;
    width: 100%;
    border-radius: 0.75rem;
  }
`;

const PaymentButton = styled.button`
  cursor: pointer;
  background-color: ${(props) => props.theme.primary.main};
  margin-left: auto;
  margin-right: auto;
  color: white;
  border: none;
  width: calc(100% - 4rem);
  border-radius: 0.6875rem;
  padding: 1rem;

  margin: 2rem 2rem 0 2rem;
`;

const MissingPhoto = styled.div`
  background-color: ${(props) => props.theme.primary.main};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  & > svg {
    height: 50%;
    width: 50%;
  }
`;

const CartView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const {
    state: { cart, userInfo },
  } = useContext(Store);

  const onBack = useCallback(() => {
    router.back();
  }, []);

  const sortedPeople = useMemo(
    () => userInfo.persons?.sort((a: Person) => (userInfo.primaryPerson.id === a.id ? -1 : 1)) || [],
    [userInfo.persons, userInfo.primaryPerson]
  );

  return (
    <MainContainer>
      <MainHeader style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', height: '4rem' }}>
        <KeyboardArrowLeft style={{ height: 32, width: 32, cursor: 'pointer' }} onClick={onBack} />
        <Title>{t('page.cart.title')}</Title>
      </MainHeader>
      <MainContent style={{ display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
        <FlexContainer>
          {((): JSX.Element => {
            if (!userInfo.persons?.length) {
              return <></>;
            }

            return sortedPeople.map((person: Person) => {
              // Get buyer, and if primary person, get unknown buyer
              let total = 0;
              let itemCount = 0;
              if (cart.buyers.length) {
                const buyer = cart.buyers.find((b: CartItemBuyer) => b.person.id === person.id);

                // Get all items from buyer
                const items =
                  buyer?.sellers.reduce((prev: CartItem[], seller: CartItemSeller) => [...prev, ...seller.items], []) ||
                  [];

                // Is primary person?
                if (userInfo.primaryPerson.id === person.id) {
                  // If yes, add these items to item array
                  const unknownBuyer = cart.buyers.find((b: CartItemBuyer) => b.person.id === null);

                  if (unknownBuyer) {
                    const unknownBuyerItems = unknownBuyer.sellers.reduce(
                      (prev: CartItem[], seller: CartItemSeller) => [...prev, ...seller.items],
                      []
                    );

                    items.push(...unknownBuyerItems);
                  }
                }

                // Get item count
                itemCount = items.length;
                // Get total
                total = items.reduce(
                  (prev: number, curr: CartItem) =>
                    prev + curr.price + curr.taxRates.reduce((p: number, tax: TaxRate) => p + tax.amount, 0),
                  0
                );
              }

              return (
                <div key={person.id}>
                  <Badge count={itemCount} position="right" pillSize="1.625rem" pillFontSize="1rem">
                    <PersonDiv onClick={() => goTo(ROUTES_ENUM.cartForPerson, { id: person.id })}>
                      {person.photoUrl ? (
                        <img src={person.photoUrl} />
                      ) : (
                        <MissingPhoto>
                          <AccountCircle />
                        </MissingPhoto>
                      )}
                      <b>
                        {person.name} {person.surname}
                      </b>
                      <span>{formatPrice(total)}</span>
                    </PersonDiv>
                  </Badge>
                </div>
              );
            });
          })()}
        </FlexContainer>
        <div style={{ flex: 1 }} />
        {(() => {
          const subTotal = cart.total.subTotal;
          const taxTotal = cart.total.taxes.reduce((prev: number, curr: TaxRate) => prev + curr.amount, 0);
          const total = subTotal + taxTotal;

          return <Total subTotal={subTotal} taxTotal={taxTotal} total={total} />;
        })()}
        <PaymentButton>{t('page.cart.pay')}</PaymentButton>
      </MainContent>
    </MainContainer>
  );
};

export default CartView;
