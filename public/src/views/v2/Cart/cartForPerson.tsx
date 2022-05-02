import { Checkbox } from '@material-ui/core';
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
import { updateCartItemSelected } from '../../../actions/service/cart';
import { Store } from '../../../Store';
import { formatPrice } from '../../../utils/stringFormats';
import MainContainer from '../common/MainLayout/Container';
import MainContent from '../common/MainLayout/Content';

import MainHeader from '../common/MainLayout/Header';
import Badge from '../ForYouPage/components/Badge';
import Total from './component/Total';

const Title = styled.h1`
  font-size: 1.75rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const SellerHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 0 2rem 0 2rem;

  img {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: 1rem;
  }

  b {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
`;

const Item = styled.div`
  box-shadow: ${(props) => props.theme.shadow.primary};
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  b {
    font-weight: semi-bold;
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  span:nth-of-type(2) {
    width: 7ch;
    text-align: right;
  }

  @media (min-width: 600px) {
    padding: 0 2rem;
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

const CartForPersonView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;

  const {
    state: { cart, userInfo },
  } = useContext(Store);

  const onBack = useCallback(() => {
    router.back();
  }, []);

  const person = useMemo(() => {
    if (!userInfo.persons) {
      return null;
    }
    return userInfo.persons.find((p: Person) => p.id === query.id);
  }, [userInfo.persons, query.id]);

  const buyersId = useMemo<string[]>(() => {
    const buyers: string[] = [];

    if (!person?.id) {
      return buyers;
    }

    buyers.push(person.id);

    if (userInfo.primaryPerson.id === person.id) {
      // Add null person id
      buyers.push(null);
    }

    return buyers;
  }, [cart.buyers, person?.id]);

  const sellers = useMemo(() => {
    if (!buyersId) {
      return [];
    }

    const sellersObj: Record<string, CartItemSeller> = {};

    buyersId.forEach((buyerId) => {
      const buyer = cart.buyers.find((b: CartItemBuyer) => b.person.id === buyerId);
      if (!buyer?.sellers) {
        return;
      }
      buyer.sellers.forEach((seller: CartItemSeller) => {
        if (!sellersObj[seller.entity.id]) {
          sellersObj[seller.entity.id] = seller;
        } else {
          sellersObj[seller.entity.id].items = [...sellersObj[seller.entity.id].items, ...seller.items];
        }
      });
    });

    return Object.values(sellersObj);
  }, [buyersId]);

  return (
    <MainContainer>
      <MainHeader style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', marginBottom: '1rem', height: '4rem' }}>
        <KeyboardArrowLeft style={{ height: 32, width: 32, cursor: 'pointer' }} onClick={onBack} />
        <Title>{t('page.cart.for_person_title', { name: person?.name })}</Title>
      </MainHeader>
      <MainContent style={{ display: 'flex', flexDirection: 'column', paddingBottom: '2rem' }}>
        {sellers?.map((seller) => (
          <div key={seller.entity.id}>
            <SellerHeader>
              <img src={seller.entity.photoUrl} />
              <b>{seller.entity.name}</b>
            </SellerHeader>
            <ItemList>
              {seller.items.map((item) => (
                <Item key={item.id}>
                  <b>{item.label}</b>
                  <Checkbox
                    checked={item.checked}
                    color="primary"
                    onClick={() => updateCartItemSelected(!item.checked, item.id)}
                  />
                  <span>{formatPrice(item.price)}</span>
                </Item>
              ))}
            </ItemList>
          </div>
        ))}
        <div style={{ flex: 1 }} />
        {(() => {
          const { subTotal, taxTotal } = sellers.reduce(
            (prev, seller) => ({
              subTotal: prev.subTotal + seller.items.reduce((p, item) => item.price + p, 0),
              taxTotal:
                prev.taxTotal +
                seller.items.reduce(
                  (p, item) => item.taxRates.reduce((prevTaxRates, taxRate) => prevTaxRates + taxRate.amount, 0) + p,
                  0
                ),
            }),
            {
              subTotal: 0,
              taxTotal: 0,
            }
          );

          const total = subTotal + taxTotal;

          return <Total subTotal={subTotal} taxTotal={taxTotal} total={total} />;
        })()}
        <PaymentButton>{t('page.cart.pay')}</PaymentButton>
      </MainContent>
    </MainContainer>
  );
};

export default CartForPersonView;
