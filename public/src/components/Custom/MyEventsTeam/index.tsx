import React, { useMemo, useState, useContext } from 'react';
import CustomCard from '../Card';
import Typography from '@material-ui/core/Typography';
import { CARD_TYPE_ENUM, ROUTES_ENUM } from '../../../../common/enums';
import { goTo } from '../../../actions/goTo';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import CustomButton from '../Button';
import CreatePractice from './CreatePractice';
import { formatRoute } from '../../../utils/stringFormats';
import api from '../../../actions/api';
import { Store } from '../../../Store';
import { Practice } from '../../../../../typescript/types';

interface IProps {
  gamesInfos: IGameInfos[];
  practiceInfos: Practice[];
  adminView: boolean;
}
interface IGameInfos {
  eventId?: string;
  eventName?: string;
  id?: string;
  timeslot: string;
  field?: string;
  name?: string;
  teamNames: string;
  teamScores: string;
}

interface IEntity {
  id: number;
  eventId?: string;
}

interface IEvent {
  location?: string;
  positions?: {
    name: string;
    score: string;
  }[];
  type: string;
  startTime: string;
  endTime?: string;
  eventId?: string;
  eventName?: string;
  id?: string;
  timeslot?: string;
  field?: string;
  name?: string;
  teamNames?: string;
  teamScores?: string;
}

const MyEventsTeam: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { gamesInfos, practiceInfos: practiceInfosProps, adminView } = props;
  const {
    state: { id },
  } = useContext(Store);
  const router = useRouter();

  const [practiceInfos, setPracticeInfos] = useState<Practice[]>(practiceInfosProps);
  const [openPractice, setOpenPractice] = useState<boolean>(false);

  const openGameDetailed = async (game: IEntity): Promise<void> => {
    goTo(ROUTES_ENUM.entity, { id: game.eventId }, { tab: router.query.tab, gameId: game.id });
  };

  const openPracticeDetailed = async (practice: IEntity): Promise<void> => {
    goTo(ROUTES_ENUM.entity, { id: router.query.id }, { tab: router.query.tab, practiceId: practice.id });
  };

  const openEventDetailed = async (event: any): Promise<void> => {
    if (event.type == CARD_TYPE_ENUM.PRACTICE) {
      openPracticeDetailed(event);
    } else {
      openGameDetailed(event);
    }
  };

  const createPractice = (): void => {
    setOpenPractice(true);
  };

  const closePractice = (): void => {
    setOpenPractice(false);
  };

  const refreshPractice = async (): Promise<void> => {
    const { data } = await api(formatRoute('/api/entity', null, { id }));

    setPracticeInfos(data.eventInfos.practiceInfos);
    setOpenPractice(false);
  };

  const events = useMemo((): IEvent[] => {
    let array = [];
    let game = gamesInfos?.map((game) => {
      const positions = [
        { name: game.teamNames[0], score: game.teamScores[0] },
        { name: game.teamNames[1], score: game.teamScores[1] },
      ];
      return {
        ...game,
        positions,
        type: CARD_TYPE_ENUM.MULTIPLE_TEAM_GAME,
        startTime: game.timeslot,
      };
    });
    array.push(game);

    let practice = practiceInfos?.map(
      (practice): IEvent => {
        return {
          id: practice.id,
          name: practice.name,
          location: practice.location,
          type: CARD_TYPE_ENUM.PRACTICE,
          startTime: practice.startDate,
          endTime: practice.endDate,
        };
      }
    );

    return practice
      .concat(game)
      .sort((a: any, b: any) => new Date(a.startTime).valueOf() - new Date(b.startTime).valueOf());
  }, [gamesInfos, practiceInfos]);

  return (
    <div>
      {adminView && (
        <CustomButton style={{ marginBottom: '6px' }} onClick={createPractice} endIcon="Add" color="primary">
          {t('create.create_practice')}
        </CustomButton>
      )}
      {events?.length ? (
        events.map((event) => (
          <CustomCard
            key={event.id}
            items={{
              ...event,
              onClick: openEventDetailed,
            }}
            type={event.type}
          />
        ))
      ) : (
        <Typography variant="h6" color="textPrimary">
          {t('no.no_games')}
        </Typography>
      )}
      <CreatePractice isOpen={openPractice} onCreate={refreshPractice} onClose={closePractice} />
    </div>
  );
};

export default MyEventsTeam;
