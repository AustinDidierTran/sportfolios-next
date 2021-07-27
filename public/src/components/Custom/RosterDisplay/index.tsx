import React, { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './RosterDisplay.module.css';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { Positions } from '../../../../../typescript/types';
import Players from './players';

interface IProps {
  teams: Positions[];
  update: () => void;
}

const RosterDisplay: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { teams, update } = props;

  const [teamIndex, setTeamIndex] = useState<number>(0);

  const displayedTeam = useMemo((): Positions => teams[teamIndex], [teams, teamIndex]);

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
      <Players roster={displayedTeam.roster} rosterId={displayedTeam.rosterId} update={update} />
    </>
  );
};
export default RosterDisplay;
