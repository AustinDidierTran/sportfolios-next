import React, { useState } from 'react';

import dynamic from 'next/dynamic';
import Icon from '../../../../components/Custom/Icon';
import Collapse from '../../../../components/Custom/Collapse';
import { useTranslation } from 'react-i18next';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';

const BasicInfos = dynamic(() => import('../../BasicInfos'));
const ChangeAlias = dynamic(() => import('../../ChangeAlias'));
const Description = dynamic(() => import('../../Description'));
const EventSettings = dynamic(() => import('../../EventSettings'));
const QuickDescription = dynamic(() => import('../../QuickDescription'));

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: 'lightGrey' },
    borderRadius: '15px !important',
    margin: '8px !important',
  },
}));

export default function General(props) {
  const { t } = useTranslation();

  const classes = useStyles();

  const { basicInfos } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <Accordion
        expanded={expanded}
        onChange={() => {
          setExpanded(!expanded);
        }}
        className={classes.primary}
      >
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" />}>
          <ListItemText primary={t('general')} />
        </AccordionSummary>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <BasicInfos basicInfos={basicInfos} />
          <ChangeAlias />
          <QuickDescription />
          <Description />
          <EventSettings />
        </Collapse>
      </Accordion>
    </div>
  );
}
