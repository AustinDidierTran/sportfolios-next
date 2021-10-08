import React, { useState, useEffect } from 'react';

import dynamic from 'next/dynamic';
import Icon from '../../../../components/Custom/Icon';
import Collapse from '../../../../components/Custom/Collapse';
import { useTranslation } from 'react-i18next';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { COLORS } from '../../../../utils/colors';
import { useContext } from 'react';
import { Store } from '../../../../Store';
import { getEvent } from '../../../../actions/service/entity/get';
import { EVENT_TYPE } from '../../../../../common/enums';

const AddOptionsEvent = dynamic(() => import('../../AddOptionsEvent'));
const TeamsRegistered = dynamic(() => import('../../TeamsRegistered'));
const PlayersRegistered = dynamic(() => import('../../PlayersRegistered'));

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: COLORS.lightGrey },
    borderRadius: '15px !important',
    margin: '8px !important',
    position: 'static',
  },
}));

export default function Registration() {
  const { t } = useTranslation();
  const {
    state: { id },
  } = useContext(Store);
  const [event, setEvent] = useState({});

  const classes = useStyles();

  useEffect(() => {
    if (id) {
      getEvent(id).then(setEvent);
    }
  }, [id]);
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Accordion
        expanded={expanded}
        onChange={() => {
          setExpanded(!expanded);
        }}
        className={classes.primary}
      >
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" />}>
          <ListItemText primary={t('register.registrations')} />
        </AccordionSummary>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          {event.eventType === EVENT_TYPE.TEAM_LEAGUE || event.eventType === EVENT_TYPE.TEAM_TOURNAMENT ? (
            <TeamsRegistered />
          ) : (
            <PlayersRegistered />
          )}
          <AddOptionsEvent />
        </Collapse>
      </Accordion>
    </>
  );
}
