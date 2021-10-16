import React from 'react';
import styles from './TicketOption.module.css';
import { Typography } from '@material-ui/core';
import { formatPrice } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';

interface IProps {
  name: string;
  description: string;
  price: number;
  action: any;
}

const TicketOption: React.FunctionComponent<IProps> = (props) => {
  const { name, price, description, action } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.ticketOption}>
      <Typography variant="h5">{name}</Typography>
      <span>{formatPrice(price)}</span>
      <p>{description}</p>
      <div>{action}</div>
    </div>
  );
};

export default TicketOption;
