import React, { useState, useContext } from 'react';

import dynamic from 'next/dynamic';
import Icon from '../../../../components/Custom/Icon';
import Card from '../../../../components/Custom/Card';
import Collapse from '../../../../components/Custom/Collapse';
import { useTranslation } from 'react-i18next';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ListItemText from '@material-ui/core/ListItemText';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { CARD_TYPE_ENUM, GLOBAL_ENUM } from '../../../../../common/enums';
import { COLORS } from '../../../../utils/colors';
import { Store } from '../../../../Store';

const ManageRoles = dynamic(() => import('../../ManageRoles'));

const useStyles = makeStyles(() => ({
  primary: {
    '&:hover, &.Mui-focusVisible': { backgroundColor: COLORS.lightGrey },
    borderRadius: '15px !important',
    margin: '8px !important',
    position: 'static',
  },
}));
export default function Admin(props) {
  const { t } = useTranslation();
  const {
    state: { id },
  } = useContext(Store);

  const { role, basicInfos } = props;

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
          <ListItemText primary={t('admin')} />
        </AccordionSummary>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <ManageRoles role={role} />
          <Card items={{ id, name: basicInfos.name, type: GLOBAL_ENUM.EVENT }} type={CARD_TYPE_ENUM.DELETE_ENTITY} />
        </Collapse>
      </Accordion>
    </>
  );
}
