import React, { useState, useEffect, useContext } from 'react';

import Typography from '@material-ui/core/Typography';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Custom/Button';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import dynamic from 'next/dynamic';
import { Store } from '../../Store';
import AddTeam from './AddTeam';
import styles from './TabRosters.module.css';
import { getAllTeamsAcceptedInfos } from '../../actions/service/entity/get';
import { AllTeamsAcceptedInfos } from '../../../../typescript/types';

const Rosters = dynamic(() => import('./Rosters'));

interface IProps {
  isAdmin: boolean;
  eventInfo: any;
}

const TabRosters: React.FunctionComponent<IProps> = (props) => {
  const { isAdmin, eventInfo } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);

  const { t } = useTranslation();
  const [rosters, setRosters] = useState<AllTeamsAcceptedInfos[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [team, setTeam] = useState<boolean>(false);
  useEffect((): void => {
    if (eventId) {
      getData();
    }
  }, [eventId]);

  const getData = async (): Promise<void> => {
    const rosters = await getAllTeamsAcceptedInfos(eventId);
    const rostersUpdated = rosters.map((roster) => {
      const players = roster.players.filter((player) => !player.isSub);
      return { ...roster, players };
    });
    setRosters(rostersUpdated);
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {isAdmin ? (
        <Button size="small" variant="contained" endIcon="Add" onClick={() => setTeam(true)} className={styles.button}>
          {t('add.add_team')}
        </Button>
      ) : null}
      {!rosters.length ? (
        <Typography color="textSecondary" style={{ margin: '16px' }}>
          {t('there_is_no_rosters_for_this_event')}
        </Typography>
      ) : (
        <Rosters eventInfo={eventInfo} isAdmin={isAdmin} rosters={rosters} update={getData} />
      )}
      <AddTeam
        isOpen={team}
        onClose={() => {
          setTeam(false);
        }}
        update={getData}
      />
    </>
  );
};
export default TabRosters;
