import React, { useMemo } from 'react';

import Tab from '../../components/Custom/Tab';
import Tabs from '../../components/Custom/Tabs';
import IgContainer from '../../components/Custom/IgContainer';
import Paper from '../../components/Custom/Paper';
import { ROUTES_ENUM, TABS_ENUM } from '../../../common/enums';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useTranslation } from 'react-i18next';
import { goTo } from '../../actions/goTo';

const CartTab = dynamic(() => import('../../tabs/Cart'));
const Purchases = dynamic(() => import('../../tabs/Purchases'));

type ITab = {
  value: string;
  component: any;
  label: string;
  icon: string;
};

const Cart: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { tab } = router.query;

  const tabs: ITab[] = [
    {
      value: TABS_ENUM.CART,
      component: CartTab,
      label: t('cart'),
      icon: 'ShoppingCartOutlined',
    },

    {
      value: TABS_ENUM.PURCHASES,
      component: Purchases,
      label: t('purchases'),
      icon: 'Store',
    },
  ];

  const index = useMemo<number>(() => {
    const res = tabs.findIndex((s) => s.value === tab);
    if (res === -1) {
      return 0;
    }
    return res;
  }, [tab, tabs]);

  const onClick = (s: ITab) => {
    goTo(ROUTES_ENUM.cart, null, { tab: s.value });
  };

  const OpenTab = useMemo<any>(() => {
    const res = tabs[index];
    if (res) {
      return res.component;
    }
    return CartTab;
  }, [index, tabs]);

  const gabriel = true;

  if (!gabriel) {
    return <></>;
  }

  return (
    <IgContainer>
      <Paper style={{ marginBottom: '8px' }}>
        <Tabs value={index} indicatorColor="primary" textColor="primary">
          {tabs.map((t, index) => (
            <Tab key={index} onClick={() => onClick(t)} icon={t.icon} label={t.label} />
          ))}
        </Tabs>
      </Paper>
      <OpenTab />
    </IgContainer>
  );
};
export default Cart;
