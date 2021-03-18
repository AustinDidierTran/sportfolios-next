import { useRouter } from 'next/router';
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../../../common/utils/stringFormat';
import api from '../../../actions/api';
import styles from './FinalRanking.module.css';
import { PHASE_STATUS_ENUM, LIST_ITEM_ENUM } from '../../../../common/enums';
import { updateRanking } from '../../Rankings/RankingFunctions';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '../../../components/Custom/Icon';
import Button from '../../../components/Custom/Button';

export default function FinalRanking(props) {
  const { phase, expandedPhases, onShrink, onExpand, onOpenAlertDialog, ...otherProps } = props;
  const { phaseId } = phase;

  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;

  const [items, setItems] = useState([]);

  useEffect(() => {
    getRankings();
  }, []);

  const isOneExpanded = useMemo(() => expandedPhases.length > 0, [expandedPhases.length]);
  const expanded = useMemo(() => expandedPhases.includes(phaseId), [expandedPhases, phaseId]);

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

    if (phase.status === PHASE_STATUS_ENUM.DONE) {
      const rankingStatsAndFinalPosition = rankingStats
        .map((r) => ({
          finalPosition: phase.ranking.find((rank) => rank.roster_id === r.rosterId).final_position,
          ...r,
        }))
        .sort((a, b) => a.finalPosition - b.finalPosition);
      setItems(rankingStatsAndFinalPosition);
    } else {
      const playedGames = games.reduce((prev, curr) => {
        const score1 = curr.teams[0].score;
        const score2 = curr.teams[1].score;
        return prev.concat([score1, score2]);
      }, []);
      if (playedGames.some((g) => g > 0)) {
        setItems(rankingStats);
      } else {
        const rankingFromInitialPosition = phase.ranking
          .map((r, index) => ({
            id: r.ranking_id,
            key: index,
            wins: 0,
            loses: 0,
            name: r.name,
            number: 1,
            pointFor: 0,
            pointAgainst: 0,
            points: 0,
            random: 0,
            rosterId: r.roster_id,
            initialPosition: r.initial_position,
          }))
          .sort((a, b) => a.initialPosition - b.initialPosition);
        setItems(rankingFromInitialPosition);
      }
    }
  };

  return (
    <>
      <Accordion expanded={expanded} onChange={expanded ? onShrink : onExpand} {...otherProps}>
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" />}>
          <div>
            <ListItemIcon>
              {!(expanded || isOneExpanded) && (
                <Icon icon="Reorder" color="textSecondary" className={styles.dragIcon} />
              )}
            </ListItemIcon>
          </div>
          {phase.status === PHASE_STATUS_ENUM.DONE ? (
            <ListItemText primary={phase.content + ' - ' + t('phase_done')}></ListItemText>
          ) : (
            <ListItemText primary={phase.content + ' - ' + t('phase_in_progress')}></ListItemText>
          )}
        </AccordionSummary>
        <div className={styles.container}>
          {phase.status !== PHASE_STATUS_ENUM.DONE && (
            <div className={styles.buttonContainer}>
              <Button
                onClick={(event) => {
                  onOpenAlertDialog(phase, event, items);
                }}
                color={'primary'}
                className={styles.button}
                endIcon="Check"
              >
                {t('end_phase')}
              </Button>
            </div>
          )}
        </div>
        <AccordionDetails>
          <div className={styles.div}>
            {items.map((item, index) => (
              <div key={index}>
                <ListItem>
                  <div className={styles.stats}>
                    <ListItemText
                      className={styles.position}
                      secondary={item.finalPosition ? item.finalPosition : item.index}
                    ></ListItemText>
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
