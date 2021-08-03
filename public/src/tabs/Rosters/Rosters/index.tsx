import React from 'react';
import styles from './Rosters.module.css';
import RosterCard from '../RosterCard';
import { AllTeamsAcceptedInfos } from '../../../../../typescript/types';

interface IProps {
  isEventAdmin: boolean;
  rosters: AllTeamsAcceptedInfos[];
  update: () => void;
}

const Rosters: React.FunctionComponent<IProps> = (props) => {
  const { isEventAdmin, rosters, update } = props;

  if (!rosters || !rosters.length) {
    // TODO: It should say there are no rosters [WCS-372]

    return null;
  }

  return (
    <div className={styles.contain}>
      {rosters.map((roster, index) => (
        <RosterCard
          isEventAdmin={isEventAdmin}
          roster={roster}
          index={index}
          key={roster.rosterId}
          update={update}
        />
      ))}
    </div>
  );
};
export default Rosters;
