import React, { useState, useEffect, useContext } from 'react';
import styles from './AllEditGames.module.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { SELECT_ENUM } from '../../../../common/enums';
import moment from 'moment';
import ProTip from './ProTip';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../../components/Custom';
import dynamic from 'next/dynamic';
import { Store } from '../../../Store';
import { getGames as getGamesApi } from '../../../actions/service/entity/get';
import { Games } from '../../../../../typescript/types';
import { sortGames } from '../../Schedule/Schedule.utils';

const GameFilters = dynamic(() => import('../../Schedule/AllGames/GameFilters'));
const EditGames = dynamic(() => import('./EditGames'));

interface IProps {
  oldFilter: IOldFilter;
  setFilter: any;
  updated: any;
}

interface IOldFilter {
  onlyYourGames: boolean;
  teamId: string;
  teamName: string;
  phaseId: string;
  phaseName: string;
  fieldId: string;
  fieldName: string;
  timeSlot: string;
}

const AllEditGames: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { oldFilter, setFilter, updated } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [games, setGames] = useState<Games[]>([]);
  const [pastGames, setPastGames] = useState<Games[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);

  useEffect((): void => {
    if (eventId) {
      getGames();
    }
  }, [eventId, updated]);

  const sortAllGames = (allGames: Games[]): void => {
    const res = sortGames(allGames);
    setGames(res.games);
    setPastGames(res.pastGames);
  };

  const getGames = async (): Promise<Games[]> => {
    const data = await getGamesApi(eventId);
    sortAllGames(data);
    setIsLoading(false);
    return data;
  };

  const filter = async (
    teamId: string,
    teamName: string,
    phaseId: string,
    phaseName: string,
    fieldId: string,
    fieldName: string,
    timeSlot: string,
    onlyYourGames: boolean
  ): Promise<void> => {
    let games = await getGames();
    const filter: {
      teamId: string;
      teamName: string;
      phaseId: string;
      phaseName: string;
      fieldId: string;
      fieldName: string;
      timeSlot: string;
      onlyYourGames: boolean;
    } = {
      teamId: SELECT_ENUM.ALL,
      teamName: '',
      phaseId: SELECT_ENUM.ALL,
      phaseName: '',
      fieldId: SELECT_ENUM.ALL,
      fieldName: '',
      timeSlot: SELECT_ENUM.ALL,
      onlyYourGames,
    };
    if (teamId != SELECT_ENUM.ALL) {
      games = games.filter((game) =>
        game.positions.some((team) => {
          if (team.rosterId) {
            return team.rosterId === teamId;
          }
          return team.name.includes(teamName);
        })
      );
      filter.teamName = teamName;
      filter.teamId = teamId;
    }
    if (phaseId != SELECT_ENUM.ALL) {
      games = games.filter((game) => game.phaseId === phaseId);
      filter.phaseName = phaseName;
      filter.phaseId = phaseId;
    }
    if (fieldId != SELECT_ENUM.ALL) {
      games = games.filter((game) => game.fieldId === fieldId);
      filter.fieldName = fieldName;
      filter.fieldId = fieldId;
    }
    if (timeSlot != SELECT_ENUM.ALL) {
      games = games.filter(
        (game) => moment.utc(game.startTime).format('YYYY M D') === moment.utc(timeSlot).format('YYYY M D')
      );
      filter.timeSlot = timeSlot;
    }
    setFilter(filter);
    sortAllGames(games);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const tabs = [{ name: t('upcoming_games') }, { name: t('past_games') }];

  return (
    <>
      <ProTip />
      <GameFilters update={filter} eventId={eventId} oldFilter={oldFilter} />
      <div className={styles.main} style={{ marginTop: '8px' }}>
        <Tabs
          value={index}
          TabIndicatorProps={{
            style: { backgroundColor: 'white' },
          }}
          className={styles.tabs}
          variant="fullWidth"
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={`${tab.name} (${games.length > 99 ? '99+' : games.length})`}
              onClick={() => {
                setIndex(index);
              }}
              className={styles.tab}
            />
          ))}
        </Tabs>
        <EditGames games={pastGames} isOpen={index == 0 ? true : false} update={getGames} />
        <EditGames games={games} isOpen={index == 1 ? true : false} update={getGames} />
      </div>
    </>
  );
};
export default AllEditGames;
