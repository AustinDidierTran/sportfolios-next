import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { formatPrice } from '../../../../utils/stringFormats';

const TotalDiv = styled.div`
  box-shadow: ${(props) => props.theme.shadow.primary};
  padding: 1rem 1rem 0.5rem 1rem;
  margin: 0 2rem 0 2rem;
  border-radius: 0.75rem;

  & > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.375rem;
    font-size: 0.875rem;
  }

  & > div:last-child {
    margin-top: 1.125rem;
    font-size: 1rem;
  }
`;

interface Props {
  subTotal: number;
  taxTotal: number;
  total: number;
}

const Total: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  return (
    <TotalDiv>
      <div>
        <span>{t('page.cart.subtotal')}</span>
        <span>{formatPrice(props.subTotal)}</span>
      </div>
      {/* TODO: Seperate taxes */}
      <div>
        <span>{t('page.cart.taxes')}</span>
        <span>{formatPrice(props.taxTotal)}</span>
      </div>
      <div>
        <b>{t('page.cart.total')}</b>
        <b>{formatPrice(props.total)}</b>
      </div>
    </TotalDiv>
  );
};

export default Total;
