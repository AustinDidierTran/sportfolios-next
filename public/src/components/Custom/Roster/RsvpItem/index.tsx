import React from 'react';

import { useTranslation } from 'react-i18next';

import ListItemText from '@material-ui/core/ListItemText';
import { Player } from '../../../../../../typescript/types';
import Rsvp from '../../MyEventsTeam/Rsvp';
import Chip from '@material-ui/core/Chip';

interface IProps {
  player?: Player;
  practiceId: string;
  personId: string;
  personList: string[];
  update: (rsvp?: string, playerId?: string) => void;
}

const RsvpItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { player, practiceId, personId, personList, update } = props;

  return (
    <>
      <ListItemText primary={player.name} />
      {player.personId == personId || personList?.includes(player.personId) ? (
        <Rsvp isOpen rsvpStatus={player.rsvp} practiceId={practiceId} playerId={player.personId} update={update} />
      ) : player.rsvp ? (
        <Chip label={t(player.rsvp)} color={player.rsvp == 'going' ? 'primary' : 'secondary'} variant="outlined" />
      ) : null}
    </>
  );
};

export default RsvpItem;
