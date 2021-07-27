import React from 'react';

import { useTranslation } from 'react-i18next';

import ListItemText from '@material-ui/core/ListItemText';
import { Player } from '../../../../../../typescript/types';
import Rsvp from '../../MyEventsTeam/Rsvp';
import Chip from '@material-ui/core/Chip';

interface IProps {
  player?: Player;
  practiceId?: string;
  gameId?: string;
  personId: string;
  personList: string[];
  rosterId?: string;
  update: (rsvp?: string, playerId?: string) => void;
}

const RsvpItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { player, practiceId, gameId, personId, personList, rosterId, update } = props;

  return (
    <>
      <ListItemText primary={player.name} secondary={t(player.role)} />
      {player.personId == personId || personList?.includes(player.personId) ? (
        <Rsvp
          isOpen
          rsvpStatus={player.rsvp}
          practiceId={practiceId}
          gameId={gameId}
          playerId={player.id}
          personId={player.personId}
          update={update}
          rosterId={rosterId}
        />
      ) : player.rsvp ? (
        <Chip label={t(player.rsvp)} color={player.rsvp == 'going' ? 'primary' : 'secondary'} variant="outlined" />
      ) : (
        <></>
      )}
    </>
  );
};

export default RsvpItem;
