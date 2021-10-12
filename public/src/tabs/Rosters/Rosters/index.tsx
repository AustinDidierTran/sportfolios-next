import React from 'react';
import styles from './Rosters.module.css';
import RosterCard from '../RosterCard';
import { AllTeamsAcceptedInfos } from '../../../../../typescript/types';

interface IProps {
  isAdmin: boolean;
  rosters: AllTeamsAcceptedInfos[];
  update: () => void;
  eventInfo: any;
}

const Rosters: React.FunctionComponent<IProps> = (props) => {
  const { isAdmin, rosters, update, eventInfo } = props;
  if (!rosters || !rosters.length) {
    // TODO: It should say there are no rosters [WCS-372]

    return null;
  }
  return (
    <div className={styles.contain}>
      {rosters.map((roster, index) => (
        <RosterCard
          isAdmin={isAdmin}
          roster={roster}
          index={index}
          key={roster.rosterId}
          update={update}
          eventInfo={eventInfo}
        />
      ))}
    </div>
  );
};
export default Rosters;
