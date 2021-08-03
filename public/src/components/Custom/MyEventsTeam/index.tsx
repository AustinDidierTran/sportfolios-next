import React, { useMemo, useState, useContext, useEffect } from 'react';
import CustomCard from '../Card';
import Typography from '@material-ui/core/Typography';
import { CARD_TYPE_ENUM, ROUTES_ENUM } from '../../../../common/enums';
import { goTo } from '../../../actions/goTo';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import CustomButton from '../Button';
import CreatePractice from './CreatePractice';
import { Store } from '../../../Store';
import { Positions, Practice, Rsvp } from '../../../../../typescript/types';
import { getMyTeamPlayers, getPracticeBasicInfo } from '../../../actions/service/entity/get';
interface IProps {
  gamesInfos: IGameInfos[];
  adminView: boolean;
}

interface IGameInfos {
  eventId?: string;
  eventName?: string;
  id?: string;
  timeslot: string;
  field?: string;
  phaseName?: string;
  teamNames: string;
  teamScores: string;
  positions: Positions;
  startTime: string;
  update?: () => void;
}

interface IEventOption {
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
  rsvp?: Rsvp[];
  update?: () => void;
}

const MyEventsTeam: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { gamesInfos, adminView } = props;
  const {
    state: { id },
  } = useContext(Store);
  const router = useRouter();

  useEffect((): void => {
    if (id) {
      getPractice();
      getIsTeamPlayer();
    }
  }, [id]);

  const [practiceInfos, setPracticeInfos] = useState<Practice[]>([]);
  const [openPractice, setOpenPractice] = useState<boolean>(false);
  const [isTeamPlayer, setIsTeamPlayer] = useState<boolean>(false);

  const getIsTeamPlayer = async () => {
    const players = await getMyTeamPlayers(id);
    setIsTeamPlayer(players.length > 0);
  };

  const openGameDetailed = async (id: string, eventId: string): Promise<void> => {
    goTo(ROUTES_ENUM.entity, { id: eventId }, { tab: router.query.tab, gameId: id });
  };

  const openPracticeDetailed = async (id: string): Promise<void> => {
    if (isTeamPlayer) {
      goTo(ROUTES_ENUM.entity, { id: router.query.id }, { tab: router.query.tab, practiceId: id });
    }
  };

  const openEventDetailed = async (id: string, eventId?: string): Promise<void> => {
    if (event.type == CARD_TYPE_ENUM.PRACTICE) {
      openPracticeDetailed(id);
    } else {
      openGameDetailed(id, eventId);
    }
  };

  const createPractice = (): void => {
    setOpenPractice(true);
  };

  const closePractice = (): void => {
    setOpenPractice(false);
  };

  const getPractice = async (): Promise<void> => {
    const data = await getPracticeBasicInfo(id);
    setPracticeInfos(data);
    setOpenPractice(false);
  };

  const update = (): void => {
    getPractice();
  };

  const events = useMemo((): IEventOption[] => {
    const array = [];
    const game = gamesInfos?.map((game) => {
      const positions = [
        { name: game.teamNames[0], score: game.teamScores[0] },
        { name: game.teamNames[1], score: game.teamScores[1] },
      ];

      return {
        game: {
          field: game.field,
          startTime: game.timeslot,
          phaseName: game.phaseName,
          positions: positions,
          eventId: game.eventId,
          id: game.id,
        },
        startTime: game.timeslot,
        type: CARD_TYPE_ENUM.MULTIPLE_TEAM_GAME,
      };
    });
    array.push(game);

    const practice = practiceInfos?.map((practice): IEventOption => {
      return {
        id: practice.id,
        name: practice.name,
        location: practice.location,
        type: CARD_TYPE_ENUM.PRACTICE,
        startTime: practice.startDate,
        endTime: practice.endDate,
        rsvp:
          practice.myRsvp?.length < 3 && practice.rsvp
            ? practice.myRsvp.concat(practice.rsvp.slice(0, 3 - practice.myRsvp.length))
            : practice.myRsvp
            ? practice.myRsvp.slice(0, 3)
            : null,
        update,
      };
    });

    if (game) {
      return practice
        .concat(game)
        .sort((a: any, b: any) => new Date(a.startTime).valueOf() - new Date(b.startTime).valueOf());
    }

    return practice.sort((a: any, b: any) => new Date(a.startTime).valueOf() - new Date(b.startTime).valueOf());
  }, [gamesInfos, practiceInfos]);

  return (
    <div>
      {adminView && (
        <CustomButton style={{ marginBottom: '6px' }} onClick={createPractice} endIcon="Add" color="primary">
          {t('create.create_activity')}
        </CustomButton>
      )}
      {events?.length ? (
        events.map((event) => (
          <div key={event.id}>
            <CustomCard
              items={{
                ...event,
                onClick: openEventDetailed,
              }}
              type={event.type}
            />
          </div>
        ))
      ) : (
        <Typography variant="h6" color="textPrimary">
          {t('no.no_events')}
        </Typography>
      )}
      <CreatePractice isOpen={openPractice} onCreate={getPractice} onClose={closePractice} />
    </div>
  );
};

export default MyEventsTeam;
