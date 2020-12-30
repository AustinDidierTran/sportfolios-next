import React, { useState } from "react";

import TabsGenerator from "../../public/src/tabs";
import { goTo, ROUTES } from "../../public/src/actions/goTo";
import {
  IgContainer,
  Paper,
  Tab,
  Tabs,
} from "../../public/src/components/Custom";
import { TABS_ENUM } from "../../public/common/enums";
import { useRouter } from "next/router";

export default function Cart() {
  const router = useRouter();
  const { query } = router;

  const [eventState, setEventState] = useState(query.tab || TABS_ENUM.CART);

  const tabsList = [TABS_ENUM.CART, TABS_ENUM.PURCHASES];
  const states = TabsGenerator({ list: tabsList });

  const OpenTab = tabsList.includes(eventState)
    ? states.find((s) => s.value == eventState).component
    : states.find((s) => s.value === TABS_ENUM.CART).component;
  const onClick = (s) => {
    goTo(ROUTES.cart, null, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <IgContainer>
      <Paper style={{ marginBottom: "8px" }}>
        <Tabs
          value={states.findIndex((s) => s.value === eventState)}
          indicatorColor="primary"
          textColor="primary"
        >
          {states.map((s, index) => (
            <Tab
              key={index}
              onClick={() => onClick(s)}
              label={s.label}
              icon={s.icon}
            />
          ))}
        </Tabs>
      </Paper>
      <OpenTab />
    </IgContainer>
  );
}
