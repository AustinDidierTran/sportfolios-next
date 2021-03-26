import React, { useState, useEffect, useMemo } from 'react';

import Icon from '../../../components/Custom/Icon';
import Paper from '../../../components/Custom/Paper';
import IgContainer from '../../../components/Custom/IgContainer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { goTo, ROUTES } from '../../../actions/goTo';
import TabsGenerator from '../../../tabs';
import { formatPageTitle } from '../../../utils/stringFormats';
import { ENTITIES_ROLE_ENUM, TABS_ENUM } from '../../../../common/enums';
import { useRouter } from 'next/router';

export default function Team(props) {
  const { basicInfos } = props;
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const [eventState, setEventState] = useState(TABS_ENUM.ABOUT);

  const userStates = TabsGenerator({
    list: [TABS_ENUM.ABOUT],
    role: basicInfos.role,
  });
  const adminStates = TabsGenerator({
    list: [TABS_ENUM.ABOUT, TABS_ENUM.SETTINGS],
    role: basicInfos.role,
  });

  const states = useMemo(() => {
    if (basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN || basicInfos.role === ENTITIES_ROLE_ENUM.EDITOR) {
      return adminStates;
    }
    return userStates;
  }, [basicInfos]);

  const OpenTab = states.find((s) => s.value == eventState).component;

  const onClick = (s) => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <IgContainer>
      <Paper>
        {window.innerWidth < 600 ? (
          <Tabs value={states.findIndex((s) => s.value === eventState)} indicatorColor="primary" textColor="primary">
            {states.map((s, index) => (
              <Tab
                key={index}
                onClick={() => onClick(s)}
                icon={<Icon icon={s.icon} />}
                style={{
                  minWidth: window.innerWidth / states.length,
                }}
              />
            ))}
          </Tabs>
        ) : (
          <Tabs value={states.findIndex((s) => s.value === eventState)} indicatorColor="primary" textColor="primary">
            {states.map((s, index) => (
              <Tab
                key={index}
                onClick={() => onClick(s)}
                label={s.label}
                icon={<Icon icon={s.icon} />}
                style={{ minWidth: 700 / states.length }}
              />
            ))}
          </Tabs>
        )}
      </Paper>
      <div>
        <OpenTab basicInfos={basicInfos} {...props} />
      </div>
    </IgContainer>
  );
}
