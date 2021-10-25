import { Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { IGameProps } from '../../..';
import { getPurchasedTickets } from '../../../../../../../actions/service/game';

const ViewerTickets: React.FunctionComponent<IGameProps> = (props) => {
  const [tickets, setTickets] = useState<any>([]);

  useEffect(() => {
    getPurchasedTickets(props.id).then((res) => setTickets(res));
  }, [props.id]);

  console.log({ tickets });

  return <Paper style={{ marginTop: '1rem' }}>Tickets!</Paper>;
};

export default ViewerTickets;
