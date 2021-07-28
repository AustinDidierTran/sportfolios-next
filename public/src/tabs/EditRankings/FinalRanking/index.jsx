import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../actions/api';
import styles from './FinalRanking.module.css';
import {
  PHASE_STATUS_ENUM,
  LIST_ITEM_ENUM,
  REQUEST_STATUS_ENUM,
  SEVERITY_ENUM,
  PHASE_TYPE_ENUM,
} from '../../../../common/enums';
import { updateRanking } from '../../Rankings/RankingFunctions';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Switch from '@material-ui/core/Switch';
import Icon from '../../../components/Custom/Icon';
import Button from '../../../components/Custom/Button';
import { withStyles } from '@material-ui/core/styles';
import { FormControlLabel } from '@material-ui/core';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ACTION_ENUM, Store } from '../../../Store';
import { getPhasesGameAndTeams } from '../../../actions/service/entity/get';
import { COLORS } from '../../../utils/colors';

const AccordionSummary = withStyles({
  content: {
    margin: '4px 0',
  },
})(MuiAccordionSummary);

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  background: isDragging ? COLORS.draggedWhite : COLORS.white,
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? COLORS.whiteSmoke : COLORS.white,
  width: '100%',
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function FinalRanking(props) {
  const { phase, expandedPhases, onShrink, onExpand, onOpenAlertDialog, prerankPhaseId, update, ...otherProps } = props;
  const { phaseId } = phase;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [items, setItems] = useState([]);
  const [isOverride, setIsOverride] = useState(false);
  const [madeChanges, setMadeChanges] = useState(false);

  useEffect(() => {
    if (eventId) {
      getRankings();
    }
  }, [eventId]);

  const isOneExpanded = useMemo(() => expandedPhases.length > 0, [expandedPhases.length]);
  const expanded = useMemo(() => expandedPhases.includes(phaseId), [expandedPhases, phaseId]);

  const getRankings = async () => {
    const { games, teams: allTeams } = await getPhasesGameAndTeams(eventId, phase.id);
    const teams = allTeams.map((team) => {
      let positionName = `${team.originPosition}. ${team.currentPhase.name}`;
      if (team.originPhase.id === prerankPhaseId) {
        positionName = `${team.originPosition}. ${t('preranking')}`;
      }
      return { ...team, position: team.initialPosition, id: team.teamId, rosterId: team.rosterId, positionName };
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
        initialPosition: t.initialPosition,
        finalPosition: t.finalPosition,
      };
    });

    if (
      rankingStats.every((r) => r.finalPosition !== null) ||
      phase.status === PHASE_STATUS_ENUM.DONE ||
      phase.type === PHASE_TYPE_ENUM.ELIMINATION_BRACKET
    ) {
      setItems(rankingStats.sort((a, b) => a.finalPosition - b.finalPosition));
    } else {
      const playedGames = games.reduce((prev, curr) => {
        const score1 = curr.teams[0].score;
        const score2 = curr.teams[1].score;
        return prev.concat([score1, score2]);
      }, []);
      if (playedGames.some((g) => g > 0)) {
        setItems(rankingStats);
      } else {
        setItems(rankingStats.sort((a, b) => a.initialPosition - b.initialPosition));
      }
    }
    setMadeChanges(false);
  };

  const handleManualSaving = async (phase, e, items) => {
    e.preventDefault();
    const res = await api('/api/entity/updatePhase', {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        phaseId: phase.phaseId,
        manualRanking: items,
      }),
    });
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('manual_ranking_updated'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('something_went_wrong'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 2000,
      });
    }
    setMadeChanges(false);
    getRankings();
    update();
  };

  const toggleManualRanking = () => {
    setIsOverride(!isOverride);
  };

  const onDragEnd = (result) => {
    if (!result.destination || result.destination.index === result.source.index) {
      return;
    } else {
      setItems(reorder(items, result.source.index, result.destination.index));
      setMadeChanges(true);
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
            <ListItemText primary={phase.content} secondary={t('phase_done')} />
          ) : (
            <ListItemText primary={phase.content} secondary={t('phase_in_progress')} />
          )}
        </AccordionSummary>
        {phase.status !== PHASE_STATUS_ENUM.DONE && (
          <FormControlLabel
            label={t('manual_ranking')}
            labelPlacement="end"
            control={<Switch checked={isOverride} onClick={toggleManualRanking} color="primary" />}
          />
        )}
        <div className={styles.container}>
          {phase.status !== PHASE_STATUS_ENUM.DONE && (
            <div className={styles.buttonContainer}>
              {isOverride ? (
                <>
                  <Button
                    onClick={(event) => {
                      handleManualSaving(phase, event, items);
                    }}
                    color={'primary'}
                    className={styles.button}
                    endIcon="SaveIcon"
                    disabled={!madeChanges}
                  >
                    {t('save')}
                  </Button>
                  <Button
                    onClick={getRankings}
                    color={'secondary'}
                    className={styles.button}
                    endIcon="Close"
                    disabled={!madeChanges}
                  >
                    {t('cancel')}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={(event) => {
                    setIsOverride(false);
                    onOpenAlertDialog(phase, event, items);
                  }}
                  color={'primary'}
                  className={styles.button}
                  endIcon="Check"
                >
                  {t('end_phase')}
                </Button>
              )}
            </div>
          )}
        </div>
        <AccordionDetails>
          <div className={styles.div}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={!isOverride}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                          >
                            <div key={index}>
                              <ListItem>
                                {isOverride && (
                                  <ListItemIcon>
                                    <Icon icon="Reorder" color="textSecondary" />
                                  </ListItemIcon>
                                )}
                                <div className={styles.stats}>
                                  <ListItemText
                                    className={styles.position}
                                    secondary={item.finalPosition ? item.finalPosition : index + 1}
                                  />
                                  <ListItemText
                                    className={styles.team}
                                    primary={item.name}
                                    secondary={item.positionName}
                                  />
                                  <ListItemText className={styles.win} primary={item.wins} secondary={'W'} />
                                  <ListItemText className={styles.lose} primary={item.loses} secondary={'L'} />
                                  <ListItemText className={styles.pointFor} primary={item.pointFor} secondary={'+'} />
                                  <ListItemText
                                    className={styles.pointAgainst}
                                    primary={item.pointAgainst}
                                    secondary={'-'}
                                  />
                                  <ListItemText
                                    className={styles.delta}
                                    primary={item.pointFor - item.pointAgainst}
                                    secondary={'+/-'}
                                  />
                                </div>
                              </ListItem>
                              <Divider />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
