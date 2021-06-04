import React, { useState, useEffect, useMemo } from 'react';

import { formatRoute } from '../../../../utils/stringFormats';
import styles from './Roster.module.css';
import Icon from '../../../../components/Custom/Icon';
import api from '../../../../actions/api';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import RosterPlayer from './RosterPlayer';

export default function Roster(props) {
  const { roster, index, update, isAdmin } = props;

  useEffect(() => {
    if (roster.id) {
      getPlayers();
    }
  }, [roster.id]);

  const [players, setPlayers] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const getPlayers = async () => {
    const { data } = await api(
      formatRoute('/api/entity/rosterPlayers', null, {
        rosterId: roster.id,
      })
    );
    setPlayers(data);
  };

  const onExpand = () => {
    setExpanded(!expanded);
  };

  const style = useMemo(() => {
    if (index % 2 === 0) {
      return styles.even;
    } else {
      return styles.odd;
    }
  }, [index]);

  return (
    <Accordion expanded={expanded} onChange={onExpand}>
      <AccordionSummary className={style} expandIcon={<Icon icon="ExpandMore" />}>
        <Typography className={styles.name}>{roster.name}</Typography>
      </AccordionSummary>
      <AccordionDetails className={styles.accordionDetail}>
        <List className={styles.list}>
          {players.map((player, index) => (
            <RosterPlayer
              key={player.id}
              player={player}
              index={index}
              update={getPlayers}
              isAdmin={isAdmin}
            ></RosterPlayer>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
