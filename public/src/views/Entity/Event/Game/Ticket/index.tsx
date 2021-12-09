import { Paper } from '@material-ui/core';
import React from 'react';
import { ITicket } from '../../../../../../../typescript/game';
import { formatPrice } from '../../../../../utils/stringFormats';
import styles from './Ticket.module.css';

interface IProps {
  photoUrl: string;
  ticket: ITicket;
}

const Ticket: React.FunctionComponent<IProps> = (props) => {
  const { photoUrl, ticket } = props;

  return (
    <Paper className={styles.ticket}>
      <img src={photoUrl} />
      <div className={styles.content}>
        <div>{`${ticket.buyer.primaryPerson.name} ${ticket.buyer.primaryPerson.surname}`}</div>
        <div>{ticket.option.name}</div>
        <div>#{ticket.number}</div>
        <div>{formatPrice(Number(ticket.option.price))}</div>
      </div>
    </Paper>
  );
};

export default Ticket;
