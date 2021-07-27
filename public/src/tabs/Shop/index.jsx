import React, { useState, useEffect, useContext } from 'react';

import styles from './Shop.module.css';
import { goTo, ROUTES } from '../../actions/goTo';

import Container from '@material-ui/core/Container';
import { Button } from '../../components/Custom';
import CustomCard from '../../components/Custom/Card';
import { useEditor } from '../../hooks/roles';

import CreateItem from './CreateItem';
import api from '../../actions/api';
import { CARD_TYPE_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../utils/stringFormats';
import { Store } from '../../Store';

export default function Shop(props) {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const {
    state: { id },
  } = useContext(Store);
  const {
    basicInfos: { role },
  } = props;
  const isEditor = useEditor(role);

  const fetchShopItems = async () => {
    const { data = [] } = await api(formatRoute('/api/shop/getItems', null, { id }), { method: 'GET' });
    setItems(data);
  };

  useEffect(() => {
    if (id) {
      fetchShopItems();
    }
  }, [id]);

  const update = () => {
    fetchShopItems();
  };

  const goToSales = () => {
    goTo(ROUTES.sales, { id });
  };

  return (
    <Container className={styles.items} style={{ marginTop: '8px' }}>
      <div>
        {isEditor ? (
          <>
            <CreateItem fetchItems={fetchShopItems} />
            <br />
            <Button onClick={goToSales}>{t('see_sales')}</Button>
            <br />
            <br />
          </>
        ) : null}
        {items.map((item, index) => {
          return <CustomCard items={{ ...item, setItems, isEditor, update }} type={CARD_TYPE_ENUM.SHOP} key={index} />;
        })}
      </div>
    </Container>
  );
}
