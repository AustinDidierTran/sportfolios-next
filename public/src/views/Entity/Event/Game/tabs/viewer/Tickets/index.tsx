import { Paper, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IGameProps } from '../../..';
import { ITicket } from '../../../../../../../../../typescript/game';
import { SEVERITY_ENUM } from '../../../../../../../../common/enums';
import { ERROR_ENUM } from '../../../../../../../../common/errors';
import { getPurchasedTickets } from '../../../../../../../actions/service/game';
import LoadingSpinner from '../../../../../../../components/Custom/LoadingSpinner';
import { ACTION_ENUM, Store } from '../../../../../../../Store';
import Ticket from '../../../Ticket';

const ViewerTickets: React.FunctionComponent<IGameProps> = (props) => {
  const { dispatch } = useContext(Store);
  const { t } = useTranslation();

  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getPurchasedTickets({ eventId: props.id })
      .then(setTickets)
      .catch(() => {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      })
      .finally(() => setIsLoading(false));
  }, [props.id]);

  return (
    <React.Fragment>
      <Paper style={{ marginTop: '1rem' }}>
        <Typography variant="h3" style={{ padding: '1rem' }}>
          {t('game.tickets')}
        </Typography>
      </Paper>
      {isLoading ? (
        <LoadingSpinner isComponent />
      ) : tickets.length ? (
        tickets.map((ticket) => <Ticket ticket={ticket} photoUrl={props.photoUrl} key={ticket.number} />)
      ) : (
        <Paper style={{ marginTop: '1rem', padding: '1rem' }}>
          <Typography variant="h3">{t('game.no_ticket_message')}</Typography>
        </Paper>
      )}
    </React.Fragment>
  );
};

export default ViewerTickets;
