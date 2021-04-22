import React, { useState } from 'react';

import dynamic from 'next/dynamic';
import Icon from '../../../../components/Custom/Icon';
import Collapse from '../../../../components/Custom/Collapse';
import { useTranslation } from 'react-i18next';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';

const AddOptionsEvent = dynamic(() => import('../../AddOptionsEvent'));
const TeamsRegistered = dynamic(() => import('../../TeamsRegistered'));
const PlayersRegistered = dynamic(() => import('../../PlayersRegistered'));

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    borderRadius: '15px !important',
    margin: '8px !important',
    position: 'static',
  },
}));

export default function Registration() {
  const { t } = useTranslation();

  const classes = useStyles();

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
          <TeamsRegistered />
          <PlayersRegistered />
          <AddOptionsEvent />
        </Collapse>
      </Accordion>
    </>
  );
}
