import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../../../../../components/Custom/Button';
import TicketOption from '../../../../../../../components/Custom/TicketOption';
import styles from './About.module.css';
import * as eventService from '../../../../../../../actions/service/event';
import { goTo, ROUTES } from '../../../../../../../actions/goTo';
import Select from '../../../../../../../components/Custom/Select';
import { IOption } from '../../../../../../../../../typescript/forms';

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

  const quantityOptions: IOption[] = Array(100)
    .fill(0)
    .map((_, index: number) => ({
      value: index,
      display: `${index}`,
    }));

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
                <Select
                  options={quantityOptions}
                  value={ticketSelection[to.id]}
                  label={t('quantity')}
                  onChange={(value: any) =>
                    setTicketSelection((ts) => ({
                      ...ts,
                      [to.id]: Number(value),
                    }))
                  }
                ></Select>
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
