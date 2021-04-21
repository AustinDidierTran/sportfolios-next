import React from 'react';
import loadable from '@loadable/component';

const CardFactory = loadable(() => import('./CardFactory'));

export { default as CardFactory } from './CardFactory';

export default function CustomCard(props) {
  const { items, type } = props;
  const Card = CardFactory({ type });
  return <Card {...items} />;
}
