import { Paper, TextField } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../../../components/Custom/Button';
import TicketOption from '../../../../../../../components/Custom/TicketOption';
import styles from './About.module.css';
import * as eventService from '../../../../../../../actions/service/event';

interface ITicketOption {
  name: string;
  price: number;
  description: string;
  id: string;
}

interface IProps {
  description: string;
  tickets: {
    options: ITicketOption[];
  };
}

const ViewerAbout: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    tickets: { options },
  } = props;

  const description = "Match du Vert & Or Volleyball les opposant aux Carabins de l'Université de Montréal";
  const [ticketSelection, setTicketSelection] = useState<Record<string, number>>({});

  useEffect(() => {
    setTicketSelection((ts) =>
      options.reduce(
        (prev: any, curr) => ({
          ...prev,
          [curr.id]: prev[curr.id] || 0,
        }),
        { ...ts }
      )
    );
  }, [options]);

  useEffect(() => {
    console.log({ ticketSelection }, Object.entries(ticketSelection));
  }, [ticketSelection]);

  return (
    <>
      {description && (
        <Paper style={{ marginTop: '1rem' }}>
          <p>{description}</p>
        </Paper>
      )}
      {Boolean(options.length) && (
        <Paper style={{ marginTop: '1rem' }} className={styles.ticketOptions}>
          {options.map((to, index: number) => (
            <TicketOption
              key={index}
              name={to.name}
              price={to.price}
              description={to.description}
              action={
                <TextField
                  type="number"
                  value={ticketSelection[to.id]}
                  label={t('quantity')}
                  onChange={(e) =>
                    setTicketSelection((ts) => ({
                      ...ts,
                      [to.id]: Number(e.target.value),
                    }))
                  }
                ></TextField>
              }
            />
          ))}
          <Button
            endIcon="ShoppingCart"
            onClick={() =>
              eventService.addTicketsToCart(
                Object.entries(ticketSelection)
                  .map((r) => ({
                    id: r[0],
                    quantity: r[1],
                  }))
                  .filter((r) => r.quantity > 0)
              )
            }
          >
            {t('add.add_to_cart')}
          </Button>
        </Paper>
      )}
    </>
  );
};

export default ViewerAbout;
