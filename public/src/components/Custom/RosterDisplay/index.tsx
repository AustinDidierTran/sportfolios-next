import React, { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ROSTER_ROLE_ENUM } from '../../../../common/enums';
import Tooltip from '@material-ui/core/Tooltip';
import Icon from '../Icon';
import styles from './RosterDisplay.module.css';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Positions } from '../../../../../typescript/types';
import Players from './players';

interface IProps {
  teams: Positions[];
}

export default function RosterDisplay(props: IProps) {
  const { t } = useTranslation();
  const { teams } = props;

  const [teamIndex, setTeamIndex] = useState(0);

  const displayedRoster = useMemo(() => teams[teamIndex].roster || [], [teams, teamIndex]);

  return (
    <>
      <Typography className={styles.title} variant="h4">
        {t('rosters')}
      </Typography>
      <div className={styles.root}>
        <Tabs
          value={teamIndex}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          style={{ width: '100%' }}
        >
          {teams.map((team, index) => (
            <Tab key={index} label={team.name} onClick={() => setTeamIndex(index)} />
          ))}
        </Tabs>
      </div>
      <Players roster={displayedRoster} />
    </>
  );
}
