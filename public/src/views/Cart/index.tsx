import React, { useState } from 'react';

import TabsGenerator from '../../tabs';
import { goTo, ROUTES } from '../../actions/goTo';
import { IgContainer, Paper, Tab, Tabs } from '../../components/Custom';
import { TABS_ENUM } from '../../../common/enums';

interface IProps {
  openTab: string;
}

const Cart: React.FunctionComponent<IProps> = (props) => {
  const { openTab } = props;

  const tabsList = [TABS_ENUM.CART, TABS_ENUM.PURCHASES];
  const states = TabsGenerator({ list: tabsList });

  const OpenTab = tabsList.includes(openTab)
    ? states.find((s: { value: string }) => s.value == openTab).component
    : states.find((s: { value: string }) => s.value === TABS_ENUM.CART).component;

  const onClick = (s: { label?: any; icon?: any; value?: any }) => {
    goTo(ROUTES.cart, null, { tab: s.value });
  };

  return (
    <IgContainer>
      <Paper style={{ marginBottom: '8px' }}>
        <Tabs
          value={states.findIndex((s: { value: string }) => s.value === openTab)}
          indicatorColor="primary"
          textColor="primary"
        >
          {states.map((s: { label: any; icon: any }, index: string | number | null | undefined) => (
            <Tab key={index} onClick={() => onClick(s)} label={s.label} icon={s.icon} />
          ))}
        </Tabs>
      </Paper>
      <OpenTab />
    </IgContainer>
  );
};

export default Cart;
