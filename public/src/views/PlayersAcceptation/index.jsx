import React from 'react';
import loadable from '@loadable/component';

const PlayersAndTeamsAcceptation = loadable(() => import('../PlayersAndTeamsAcceptation'));

export default function PlayersAcceptation(props) {
  const { cards, update, getCards } = props;
  return <PlayersAndTeamsAcceptation cards={cards} update={update} getCards={getCards} />;
}
