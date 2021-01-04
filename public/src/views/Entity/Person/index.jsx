import React, { useMemo, useState, useEffect } from 'react';

import { Paper, IgContainer, Tab, Tabs } from '../../../components/Custom';
import { formatPageTitle } from '../../../utils/stringFormats';
import TabsGenerator from '../../../tabs';
import { goTo, ROUTES } from '../../../actions/goTo';
import { TABS_ENUM } from '../../../../common/enums';
import { useRouter } from 'next/router';

export default function Person(props) {
  const { basicInfos } = props;
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, [basicInfos]);

  const states = TabsGenerator({
    list: [TABS_ENUM.ABOUT, TABS_ENUM.EDIT_PERSON_INFOS],
    role: basicInfos.role,
  });

  const [eventState, setEventState] = useState(TABS_ENUM.ABOUT);

  const OpenTab = useMemo(() => states.find((s) => s.value == eventState).component, [eventState, states]);

  const onClick = (s) => {
    goTo(ROUTES.entity, { id }, { tab: s.value });
    setEventState(s.value);
  };

  return (
    <IgContainer>
      <Paper>
        <Tabs value={states.findIndex((s) => s.value === eventState)} indicatorColor="primary" textColor="primary">
          {states.map((s, index) => (
            <Tab key={index} onClick={() => onClick(s)} icon={s.icon} label={s.label} />
          ))}
        </Tabs>
      </Paper>
      <div>
        <OpenTab {...props} />
      </div>
    </IgContainer>
  );
}
