import React, { useState, useEffect, useContext } from 'react';
import styles from './Games.module.css';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { SELECT_ENUM } from '../../../../common/enums';
import moment from 'moment';
import GameFilters from './GameFilters';
import Games from './Games';
import { useTranslation } from 'react-i18next';
import ProTip from './ProTip';
import { LoadingSpinner } from '../../../components/Custom';
import { Store } from '../../../Store';
import { Games as IGames } from '../../../../../typescript/types';
import { getGames as getGamesApi } from '../../../actions/service/entity/get';
import { sortGames } from '../Schedule.utils';

interface IProps {
  oldFilter: IFilter;
  setFilter: (filter: IFilter) => void;
}

interface IFilterFields {
  value: string;
  display: string;
}

interface IFilter {
  teams: IFilterFields[];
  phases: IFilterFields[];
  fields: IFilterFields[];
  timeSlots: IFilterFields[];
  onlyYourGames: boolean;
}

const AllGames: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    state: { id: eventId },
  } = useContext(Store);

  const { setFilter, oldFilter } = props;
  const [games, setGames] = useState<IGames[]>([]);
  const [pastGames, setPastGames] = useState<IGames[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [index, setIndex] = useState<number>(0);

  useEffect((): void => {
    if (eventId) {
      getGames();
    }
  }, [eventId]);

  const sortAllGames = (allGames: IGames[]): void => {
    const res = sortGames(allGames);
    setGames(res.games);
    setPastGames(res.pastGames);
  };

  const getGames = async (): Promise<IGames[]> => {
    if (eventId) {
      const data = await getGamesApi(eventId);
      if (!data) {
        return [];
      }
      sortAllGames(data);
      setIsLoading(false);
      return data;
    }
    setIsLoading(false);
  };
  const filter = async (
    teams: IFilterFields[],
    phases: IFilterFields[],
    fields: IFilterFields[],
    timeSlots: IFilterFields[],
    onlyYourGames: boolean
  ): Promise<boolean | void> => {
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
      games = games.filter((game: IGames) =>
        game.positions.some((team) => {
          if (team.rosterId) {
            return teams.filter((t) => t.value === team.rosterId).length > 0;
            ``;
          }
          return teams.filter((t) => t.display === team.name).length > 0;
        })
      );
      filter.teams = teams;
    }
    if (phases[0].value != SELECT_ENUM.ALL) {
      games = games.filter((game: IGames) => phases.some((phase) => phase.value === game.phaseId));
      filter.phases = phases;
    }
    if (fields[0].value != SELECT_ENUM.ALL) {
      games = games.filter((game: IGames) => fields.some((field) => field.value === game.fieldId));
      filter.fields = fields;
    }
    if (timeSlots[0].value != SELECT_ENUM.ALL) {
      games = games.filter((game: IGames) =>
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
        <Games games={games} isOpen={index == 0 ? true : false} />
        <Games games={pastGames} isOpen={index == 1 ? true : false} />
      </div>
    </>
  );
};
export default AllGames;
