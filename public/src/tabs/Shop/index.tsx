import React, { useState, useEffect, useContext } from 'react';

import styles from './Shop.module.css';
import { goTo, ROUTES } from '../../actions/goTo';

import Container from '@material-ui/core/Container';
import { Button } from '../../components/Custom';
import CustomCard from '../../components/Custom/Card';

import CreateItem from './CreateItem';
import { useTranslation } from 'react-i18next';
import { Store } from '../../Store';
import { ShopItems, Tax } from '../../../../typescript/types';
import { getShopItems } from '../../actions/service/shop';
import { getTaxes as getTaxesApi } from '../../actions/service/stripe';
import { CARD_TYPE_ENUM } from '../../../common/enums';

interface IProps {
  adminView: boolean;
}

interface TaxesOption extends Tax {
  display: string;
  value: string;
}

const Shop: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<ShopItems[]>();
  const [allTaxes, setAllTaxes] = useState<TaxesOption[]>();
  const {
    state: { id },
  } = useContext(Store);
  const { adminView } = props;

  const fetchShopItems = (): void => {
    getShopItems(id).then((res) => {
      setItems(
        res.map((r) => ({
          ...r,
          sizes: JSON.parse(r.sizes),
          taxRatesId: r.taxRatesId,
        }))
      );
    });
  };

  const getTaxes = async (): Promise<void> => {
    const data = await getTaxesApi();
    const res = data.map((d) => ({
      id: d.id,
      percentage: d.percentage,
      display: `${d.displayName} ${d.percentage} %`,
      value: d.id,
    }));

    setAllTaxes(res);
  };

  useEffect((): void => {
    if (id) {
      fetchShopItems();
      getTaxes();
    }
  }, [id]);

  const update = (): void => {
    fetchShopItems();
  };

  const goToSales = (): void => {
    goTo(ROUTES.sales, { id });
  };

  return (
    <Container className={styles.items} style={{ marginTop: '8px' }}>
      <div>
        {adminView ? (
          <>
            <CreateItem fetchItems={fetchShopItems} allTaxes={allTaxes} />
            <br />
            <Button onClick={goToSales}>{t('see_sales')}</Button>
            <br />
            <br />
          </>
        ) : null}
        {items?.map((item, index) => (
          <CustomCard
            items={{ ...item, setItems, adminView, update, allTaxes }}
            type={CARD_TYPE_ENUM.SHOP}
            key={index}
          />
        ))}
      </div>
    </Container>
  );
};
export default Shop;
