import React from 'react';
import styles from './TicketOption.module.css';
import { Typography } from '@material-ui/core';
import { formatPrice } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { ITicketOption } from '../../../../../typescript/game';

interface IProps {
  ticketOption: ITicketOption;
  action: any;
}

const TicketOption: React.FunctionComponent<IProps> = (props) => {
  const { ticketOption, action } = props;

  return (
    <div className={styles.ticketOption}>
      <Typography variant="h5">{ticketOption.name}</Typography>
      <span>{formatPrice(ticketOption.price)}</span>
      <p>{ticketOption.description}</p>
      <div>{action}</div>
    </div>
  );
};

export default TicketOption;
