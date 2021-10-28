import { Paper, TextField } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../../../components/Custom/Button';
import TicketOption from '../../../../../../../components/Custom/TicketOption';
import styles from './About.module.css';
import * as eventService from '../../../../../../../actions/service/event';
import { goTo, ROUTES } from '../../../../../../../actions/goTo';

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
  name: string;
  photoUrl: string;
}

const ViewerAbout: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    description,
    name,
    photoUrl,
    tickets: { options },
  } = props;

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

  const onAddTickets = () => {
    eventService
      .addTicketsToCart(
        Object.entries(ticketSelection)
          .map((r) => ({
            metadata: {
              id: r[0],
              quantity: r[1],
              name,
              photoUrl,
            },
            id: r[0],
            quantity: r[1],
          }))
          .filter((r) => r.quantity > 0)
      )
      .then(() => {
        goTo(ROUTES.cart);
      });
  };

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
              ticketOption={{
                name: to.name,
                price: to.price,
                description: to.description,
              }}
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
          <Button endIcon="ShoppingCart" onClick={onAddTickets}>
            {t('add.add_to_cart')}
          </Button>
        </Paper>
      )}
    </>
  );
};

export default ViewerAbout;
