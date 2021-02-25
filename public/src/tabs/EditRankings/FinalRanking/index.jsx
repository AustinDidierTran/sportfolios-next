import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../../../common/utils/stringFormat';
import api from '../../../actions/api';
import styles from './FinalRanking.module.css';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Icon from '../../../components/Custom/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { LIST_ITEM_ENUM } from '../../../../common/enums';
import { updateRanking } from '../../Rankings/RankingFunctions';
import { Accordion, AccordionDetails, Divider, ListItem, ListItemText } from '@material-ui/core';

export default function FinalRanking(props) {
  const { phase, isOneExpanded, expandedPhases, setExpandedPhases, ...otherProps } = props;
  const { phaseId } = phase;

  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;

  const [expanded, setExpanded] = useState(false);

  const [items, setItems] = useState([]);

  useEffect(() => {
    getRankings();
  }, []);

  const onExpand = () => {
    setExpanded(true);
    if (!expandedPhases.includes(phaseId)) {
      setExpandedPhases(expandedPhases.concat([phaseId]));
    }
  };

  const onShrink = () => {
    setExpanded(false);
    if (expandedPhases.includes(phaseId)) {
      const newExpandedPhases = expandedPhases.filter((p) => p !== phaseId);
      setExpandedPhases(newExpandedPhases);
    }
  };

  const getRankings = async () => {
    const {
      data: { games, teams: allTeams },
    } = await api(
      formatRoute('/api/entity/phasesGameAndTeams', null, {
        eventId,
        phaseId: phase.id,
      })
    );
    let teams = [];
    let position = 1;
    games.forEach((g) => {
      if (!teams.filter((team) => team.id === g.teams[0].team_id).length) {
        teams.push({
          name: g.teams[0].name,
          roster_id: g.teams[0].roster_id,
          id: g.teams[0].team_id,
          position,
        });
        position = position + 1;
      }
      if (!teams.filter((team) => team.id === g.teams[1].team_id).length) {
        teams.push({
          name: g.teams[1].name,
          roster_id: g.teams[1].roster_id,
          id: g.teams[1].team_id,
          position,
        });
        position = position + 1;
      }
    });
    games.map((game) => {
      const res1 = teams.find((t) => game.teams[0].team_id === t.id);
      game.teams[0].position = res1.position;

      const res2 = teams.find((t) => game.teams[1].team_id === t.id);
      game.teams[1].position = res2.position;
    });
    allTeams.forEach((t) => {
      if (!teams.map((t) => t.id).includes(t.teamId)) {
        teams.push({ name: t.name, position: t.initial_position, roster_id: t.roster_id, id: t.teamId });
      }
    });

    const res = updateRanking(teams, games);

    const rankingStats = res.map((r, index) => ({
      ...r,
      type: LIST_ITEM_ENUM.RANKING_WITH_STATS,
      index: index + 1,
      key: index,
    }));

    setItems(rankingStats);
  };

  return (
    <>
      <Accordion expanded={expanded} onChange={expanded ? onShrink : onExpand} {...otherProps}>
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" className={styles.dragIcon} />}>
          <div>
            <ListItemIcon>
              {expanded || isOneExpanded ? <></> : <Icon icon="Reorder" color="textSecondary" />}
            </ListItemIcon>
          </div>
          <ListItemText primary={phase.content + ' - ' + t('phase_done')}></ListItemText>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.div}>
            {items.map((item, index) => (
              <div key={index}>
                <ListItem>
                  <div className={styles.stats}>
                    <ListItemText className={styles.position} secondary={item.index}></ListItemText>
                    <ListItemText className={styles.team} primary={item.name}></ListItemText>
                    <ListItemText className={styles.win} primary={item.wins} secondary={'W'}></ListItemText>
                    <ListItemText className={styles.lose} primary={item.loses} secondary={'L'}></ListItemText>
                    <ListItemText className={styles.pointFor} primary={item.pointFor} secondary={'+'}></ListItemText>
                    <ListItemText
                      className={styles.pointAgainst}
                      primary={item.pointAgainst}
                      secondary={'-'}
                    ></ListItemText>
                    <ListItemText
                      className={styles.delta}
                      primary={item.pointFor - item.pointAgainst}
                      secondary={'+/-'}
                    ></ListItemText>
                  </div>
                </ListItem>
                <Divider />
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
