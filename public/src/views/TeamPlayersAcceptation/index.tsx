import React from 'react';
import dynamic from 'next/dynamic';

const PlayersAndTeamsAcceptation = dynamic(() => import('../PlayersAndTeamsAcceptation'));

interface IProps {
  cards: any;
  update: (personId: string, status: string) => void;
  getCards: () => void;
  name: string;
}

const TeamPlayersAcceptation: React.FunctionComponent<IProps> = (props) => {
  const { cards, update, getCards, name } = props;
  return <PlayersAndTeamsAcceptation cards={cards} update={update} getCards={getCards} name={name} />;
};
export default TeamPlayersAcceptation;
