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
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '../../../components/Custom/Icon';
import Button from '../../../components/Custom/Button';
import { withStyles } from '@material-ui/core/styles';

const AccordionSummary = withStyles({
  content: {
    '&$expanded': {
      margin: '8px 0',
    },
    margin: '4px 0',
  },
})(MuiAccordionSummary);

export default function FinalRanking(props) {
  const { phase, expandedPhases, onShrink, onExpand, onOpenAlertDialog, prerankPhaseId, ...otherProps } = props;
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
    const teams = allTeams.map((team) => {
      let positionName = `${team.origin_position}. ${team.phaseName}`;
      if (team.origin_phase === prerankPhaseId) {
        positionName = `${team.origin_position}. ${t('preranking')}`;
      }
      return { ...team, position: team.initial_position, id: team.teamId, rosterId: team.roster_id, positionName };
    });

    const res = updateRanking(teams, games);

    const rankingStats = res.map((r, index) => {
      const t = teams.find((t) => t.id === r.id);

      return {
        ...r,
        type: LIST_ITEM_ENUM.RANKING_WITH_STATS,
        index: index + 1,
        key: index,
        positionName: t.positionName,
        initialPosition: t.initial_position,
        finalPosition: t.final_position,
      };
    });

    if (phase.status === PHASE_STATUS_ENUM.DONE) {
      const rankingStatsAndFinalPosition = rankingStats.sort((a, b) => a.finalPosition - b.finalPosition);
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
        const rankingFromInitialPosition = rankingStats.sort((a, b) => a.initialPosition - b.initialPosition);
        setItems(rankingFromInitialPosition);
      }
    }
  };

  return (
    <>
      <Accordion expanded={expanded} onChange={expanded ? onShrink : onExpand} {...otherProps}>
        <AccordionSummary expandIcon={<Icon icon="ExpandMore" />}>
          <div className={styles.reorder}>
            <ListItemIcon>{!(expanded || isOneExpanded) && <Icon icon="Reorder" color="textSecondary" />}</ListItemIcon>
          </div>
          {phase.status === PHASE_STATUS_ENUM.DONE ? (
            <ListItemText primary={phase.content} secondary={t('phase_done')}></ListItemText>
          ) : (
            <ListItemText primary={phase.content} secondary={t('phase_in_progress')}></ListItemText>
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
                      secondary={item.finalPosition ? item.finalPosition : index + 1}
                    ></ListItemText>
                    <ListItemText
                      className={styles.team}
                      primary={item.name}
                      secondary={item.positionName}
                    ></ListItemText>
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
