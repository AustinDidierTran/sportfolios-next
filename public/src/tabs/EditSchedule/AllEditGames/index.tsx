import React, { useState, useEffect, useContext } from 'react';
import styles from './AllEditGames.module.css';
import { SELECT_ENUM } from '../../../../common/enums';
import moment from 'moment';
import ProTip from './ProTip';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '../../../components/Custom';
import dynamic from 'next/dynamic';
import { Store } from '../../../Store';
import { getGames as getGamesApi } from '../../../actions/service/entity/get';
import { Games } from '../../../../../typescript/types';

const GameFilters = dynamic(() => import('../../Schedule/AllGames/GameFilters'));
const EditGames = dynamic(() => import('./EditGames'));

interface IProps {
  oldFilter: IOldFilter;
  setFilter: any;
  updated: any;
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
  const { oldFilter, setFilter, updated } = props;
  const {
    state: { id: eventId },
  } = useContext(Store);

  const [games, setGames] = useState<Games[]>([]);
  const [pastGames, setPastGames] = useState<Games[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect((): void => {
    if (eventId) {
      getGames();
    }
  }, [eventId, updated]);

  const sortGames = (games: Games[]): void => {
    const res = games
      .filter((game) => moment(game.startTime).set('hour', 0).set('minute', 0).add(1, 'day') > moment())
      .sort((a, b) => Math.abs(moment(a.startTime).valueOf() - moment(b.startTime).valueOf()));
    setGames(res);
    const pastGames = games
      .filter((game) => moment(game.startTime).set('hour', 0).set('minute', 0).add(1, 'day') < moment())
      .sort((a, b) => Math.abs(moment(a.startTime).valueOf() - moment(b.startTime).valueOf()));
    setPastGames(pastGames);
  };

  const getGames = async (): Promise<Games[]> => {
    const data = await getGamesApi(eventId);
    sortGames(data);
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
      teams: [{value: SELECT_ENUM.ALL, display: ''}],
      phases: [{value: SELECT_ENUM.ALL, display: ''}],
      fields: [{value: SELECT_ENUM.ALL, display: ''}],
      timeSlots: [{value: SELECT_ENUM.ALL, display: ''}],
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
        (timeSlots.some(
          (timeSlot) => moment(game.startTime).format('YYYY M D') === moment(timeSlot.value).format('YYYY M D')
        ))
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
        <EditGames title={t('past_games')} games={pastGames} isOpen={false} update={getGames} />
        <EditGames title={t('upcoming_games')} games={games} isOpen update={getGames} />
      </div>
    </>
  );
};
export default AllEditGames;
