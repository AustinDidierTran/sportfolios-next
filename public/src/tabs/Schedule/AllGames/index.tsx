import React, { useState, useEffect, useContext } from 'react';
import styles from './Games.module.css';
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

  useEffect((): void => {
    if (eventId) {
      getGames();
    }
  }, [eventId]);

  const scoreIsSubmitted = (game: IGames): boolean => game.positions[0].score != 0 || game.positions[1].score != 0;

  const sortGames = (games: IGames[]): void => {
    const pastGames = games
      .filter(
        (game) =>
          moment(game.startTime).set('hour', 0).set('minute', 0).add(1, 'day') < moment() && scoreIsSubmitted(game)
      )
      .sort((a, b) => {
        return moment(a.startTime).valueOf() - moment(b.startTime).valueOf();
      });
    setPastGames(pastGames);
    const res = games
      .filter(
        (game) =>
          moment(game.startTime).set('hour', 0).set('minute', 0).add(1, 'day') > moment() || !scoreIsSubmitted(game)
      )
      .sort((a, b) => {
        return moment(a.startTime).valueOf() - moment(b.startTime).valueOf();
      });
    setGames(res);
  };

  const getGames = async (): Promise<IGames[]> => {
    if (eventId) {
      const data = await getGamesApi(eventId);
      if (!data) {
        return [];
      }
      sortGames(data);
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
    sortGames(games);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <ProTip />
      <GameFilters update={filter} eventId={eventId} oldFilter={oldFilter} />
      <div className={styles.main} style={{ marginTop: '16px' }}>
        <Games games={pastGames} title={t('past_games')} isOpen={false} />
        <Games games={games} title={t('upcoming_games')} isOpen />
      </div>
    </>
  );
};
export default AllGames;
