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
}

interface IFilterFields {
  value: string;
  display: string;
}

interface IOldFilter {
  onlyYourGames: boolean;
  teams: IFilterFields[];
  phases: IFilterFields[];
  fields: IFilterFields[];
  timeSlots: IFilterFields[];
}

const AllEditGames: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { oldFilter, setFilter } = props;
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
  }, [eventId]);

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
    teams: IFilterFields[],
    phases: IFilterFields[],
    fields: IFilterFields[],
    timeSlots: IFilterFields[],
    onlyYourGames: boolean
  ): Promise<void> => {
    let games = await getGames();
    const filter: {
      teams: IFilterFields[];
      phases: IFilterFields[];
      fields: IFilterFields[];
      timeSlots: IFilterFields[];
      onlyYourGames: boolean;
    } = {
      teams: [{ value: SELECT_ENUM.ALL, display: '' }],
      phases: [{ value: SELECT_ENUM.ALL, display: '' }],
      fields: [{ value: SELECT_ENUM.ALL, display: '' }],
      timeSlots: [{ value: SELECT_ENUM.ALL, display: '' }],
      onlyYourGames,
    };
    if (teams[0].value != SELECT_ENUM.ALL) {
      games = games.filter((game) =>
        game.positions.some((team) => {
          if (team.rosterId) {
            return teams.filter((t) => t.value === team.rosterId).length > 0;
          }
          return teams.filter((t) => t.display === team.name).length > 0;
        })
      );
      filter.teams = teams;
    }
    if (phases[0].value != SELECT_ENUM.ALL) {
      games = games.filter((game: Games) => phases.some((phase) => phase.value === game.phaseId));
      filter.phases = phases;
    }
    if (fields[0].value != SELECT_ENUM.ALL) {
      games = games.filter((game: Games) => fields.some((field) => field.value === game.fieldId));
      filter.fields = fields;
    }
    if (timeSlots[0].value != SELECT_ENUM.ALL) {
      games = games.filter((game: Games) =>
        timeSlots.some(
          (timeSlot) => moment(game.startTime).format('YYYY M D') === moment(timeSlot.value).format('YYYY M D')
        )
      );
      filter.timeSlots = timeSlots;
    }
    setFilter(filter);
    sortAllGames(games);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const tabs = [
    { name: t('upcoming_games'), game: games },
    { name: t('past_games'), game: pastGames },
  ];

  const update = () => {
    if (oldFilter) {
      filter(oldFilter.teams, oldFilter.phases, oldFilter.fields, oldFilter.timeSlots, oldFilter.onlyYourGames);
    }
  };

  return (
    <>
      <ProTip />
      <GameFilters update={filter} eventId={eventId} oldFilter={oldFilter} />
      <div className={styles.main} style={{ marginTop: '8px' }}>
        <Tabs value={index} indicatorColor="primary" textColor="primary" className={styles.tabs} variant="fullWidth">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={`${tab.name} (${tab.game.length > 99 ? '99+' : tab.game.length})`}
              onClick={() => {
                setIndex(index);
              }}
              className={styles.tab}
            />
          ))}
        </Tabs>
        <EditGames games={games} isOpen={index === 0} update={update} />
        <EditGames games={pastGames} isOpen={index === 1} update={update} />
      </div>
    </>
  );
};
export default AllEditGames;
