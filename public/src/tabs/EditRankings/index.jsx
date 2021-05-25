import React, { useState, useEffect, useContext } from 'react';

import api from '../../actions/api';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../utils/stringFormats';
import Button from '../../components/Custom/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ACTION_ENUM, Store } from '../../Store';
import { PHASE_STATUS_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../common/enums';
import { ERROR_ENUM } from '../../../common/errors';
import dynamic from 'next/dynamic';
import { useWindowSize } from '../../hooks/window';
import { MOBILE_WIDTH } from '../../../common/constants';

const PhaseAccordionDnD = dynamic(() => import('./PhaseAccordionDnD'));
const PrerankAccordionDnD = dynamic(() => import('./PrerankAccordionDnd'));
const FinalRanking = dynamic(() => import('./FinalRanking'));
const AlertDialog = dynamic(() => import('../../components/Custom/Dialog/AlertDialog'));
const AddPhase = dynamic(() => import('../EditSchedule/CreateSchedule/AddPhase'));

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  ...draggableStyle,
});

const getListStyle = () => ({
  width: '100%',
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function EditRankings() {
  const [width] = useWindowSize();
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [phases, setPhases] = useState([]);
  const [preranking, setPreranking] = useState([]);
  const [expandedPhases, setExpandedPhases] = useState([]);

  const [phaseToEnd, setPhaseToEnd] = useState({});
  const [phaseToDelete, setPhaseToDelete] = useState({});
  const [prerankPhase, setPrerankPhase] = useState({});

  const [openPhase, setOpenPhase] = useState(false);
  const [madeChanges, setMadeChanges] = useState(false);
  const [isOneExpanded, setIsOneExpanded] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (eventId) {
      getData();
    }
  }, [eventId]);

  useEffect(() => {
    if (expandedPhases.length) {
      setIsOneExpanded(true);
    } else {
      setIsOneExpanded(false);
    }
  }, [expandedPhases.length]);

  const getData = async () => {
    const { data: prerankPhase } = await api(
      formatRoute('/api/entity/prerankPhase', null, {
        eventId,
      })
    );

    setPrerankPhase(prerankPhase);

    const {
      data: { preranking: ranking },
    } = await api(
      formatRoute('/api/entity/preranking', null, {
        eventId,
      })
    );

    const { data: phases } = await api(
      formatRoute('/api/entity/phases', null, {
        eventId,
      })
    );

    let preranking = [];

    if (ranking) {
      preranking = ranking.map((d) => ({
        position: d.position,
        content: d.noTeam ? t('register.register_team') : d.name,
        rosterId: d.rosterId ? d.rosterId : null,
        rankingId: d.rankingId,
      }));
    }

    const allPhases = phases
      .map((d) => ({
        content: d.name,
        phaseId: d.id,
        id: d.id,
        spots: d.spots,
        status: d.status,
        order: d.phase_order,
        ranking: d.ranking.map((r) => {
          if (r && r.roster_id) {
            if (r.origin_phase === prerankPhase.phaseId) {
              return {
                ...r,
                rankingId: r.ranking_id,
                positionName: `${r.origin_position}. ${t('preranking')}`,
                name: r.name,
              };
            }
            return {
              ...r,
              rankingId: r.ranking_id,
              positionName: `${r.origin_position}. ${r.phaseName}`,
              name: r.name,
            };
          }
          if (r && r.origin_phase && r.origin_position) {
            if (r.origin_phase === prerankPhase.phaseId) {
              const rankingWithName = preranking.find((p) => p.position === r.origin_position);
              if (rankingWithName.rosterId) {
                return {
                  ...r,
                  rankingId: r.ranking_id,
                  name: rankingWithName.content,
                  positionName: `${r.origin_position}. ${t('preranking')}`,
                };
              } else {
                return {
                  ...r,
                  rankingId: r.ranking_id,
                  positionName: `${r.origin_position}. ${t('preranking')}`,
                };
              }
            }
            return { ...r, rankingId: r.ranking_id, positionName: `${r.origin_position}. ${r.phaseName}` };
          }
          return { ...r, isEmpty: true, rankingId: r.ranking_id };
        }),
      }))
      .sort((a, b) => a.order - b.order);

    setPreranking(preranking);
    setPhases(allPhases);
  };

  const handleUpdateOrder = async () => {
    const res = await api('/api/entity/updatePhaseOrder', {
      method: 'PUT',
      body: JSON.stringify({
        orderedPhases: phases,
        eventId,
      }),
    });

    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('order_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
    setMadeChanges(false);
    update();
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    } else {
      const newPhase = reorder(phases, result.source.index, result.destination.index);
      setMadeChanges(true);
      setPhases(newPhase);
    }
  };

  const handleDeleteTeam = async (phaseId, position) => {
    await api('/api/entity/teamPhase', {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        phaseId,
        initialPosition: position,
      }),
    });
    update();
  };

  const startPhase = (phase, event, madeChanges) => {
    event.stopPropagation();
    if (!madeChanges) {
      handleStartPhase(phase);
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('save_changes_before_starting_phase'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 2000,
      });
    }
  };

  const handleStartPhase = async (phase) => {
    const rankingsFromPhase = phase.ranking.filter((r) => r.origin_phase && !r.roster_id);
    const rankingsFromPrerank = phase.ranking.filter((r) => r.origin_phase === prerankPhase.phaseId && !r.roster_id);
    const emptyRankings = phase.ranking.filter((r) => !r.origin_phase && !r.origin_position);
    const rankingsWithRosterId = phase.ranking.map((r) => r.roster_id);

    if (!rankingsWithRosterId.includes(null) && phase.spots !== 0) {
      const res = await api('/api/entity/updatePhase', {
        method: 'PUT',
        body: JSON.stringify({
          eventId,
          phaseId: phase.phaseId,
          status: PHASE_STATUS_ENUM.STARTED,
        }),
      });
      if (res.status === STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('phase_started'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
      }
      update();
    } else if (phase.spots === 0 || emptyRankings.length) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('empty_phase_spots_warning'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else if (rankingsFromPrerank.length) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_team_in_prerank_position'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    } else if (rankingsFromPhase.length) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('start_phase_warning'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
  };

  const endPhase = async () => {
    const res = await api('/api/entity/updatePhase', {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        phaseId: phaseToEnd.phaseId,
        status: PHASE_STATUS_ENUM.DONE,
        finalRanking: phaseToEnd.finalRanking,
      }),
    });
    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('phase_done'),
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
    update();
    setOpenAlertDialog(false);
  };

  const handleDeletePhase = async () => {
    const res = await api(
      formatRoute('/api/entity/phase', null, {
        eventId: eventId,
        phaseId: phaseToDelete.id,
      }),
      {
        method: 'DELETE',
      }
    );
    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('delete.delete_phase_success'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 4000,
      });
      update();
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
    }
    setOpenDeleteDialog(false);
  };

  const update = () => {
    getData();
  };

  const closePhaseDialog = () => {
    setOpenPhase(false);
  };

  const openPhaseDialog = () => {
    setOpenPhase(true);
  };

  const onCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  const onOpenAlertDialog = (phase, event, items) => {
    event.preventDefault();
    setPhaseToEnd({ ...phase, finalRanking: items });
    setOpenAlertDialog(true);
  };

  const onCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const onOpenDeleteDialog = (phase) => {
    setPhaseToDelete(phase);
    setOpenDeleteDialog(true);
  };

  const onShrink = (phaseId) => {
    setExpandedPhases((e) => e.filter((p) => p !== phaseId));
  };

  const onExpand = (phaseId) => {
    setExpandedPhases((e) => [...e, phaseId]);
  };

  return (
    <div className={styles.main}>
      <div className={styles.buttonContainer}>
        <Button className={styles.button} onClick={openPhaseDialog} endIcon="Add">
          <div className={styles.buttonText}>{width < MOBILE_WIDTH ? t('add.add') : t('add.add_phase')}</div>
        </Button>
        <Button className={styles.button} onClick={handleUpdateOrder} endIcon="SaveIcon" disabled={!madeChanges}>
          <div className={styles.buttonText}>{width < MOBILE_WIDTH ? t('save') : t('save_phase_order')}</div>
        </Button>
      </div>
      <div className={styles.div}>
        <PrerankAccordionDnD
          title={t('preranking')}
          ranking={preranking}
          update={getData}
          id={'preranking'}
        ></PrerankAccordionDnD>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)}>
              <div>
                {phases.map((phase, index) => (
                  <Draggable
                    key={phase.id}
                    draggableId={phase.id}
                    index={index}
                    className={styles.draggable}
                    isDragDisabled={isOneExpanded}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <div className={styles.div} key={phase.id}>
                          {phase.status !== PHASE_STATUS_ENUM.NOT_STARTED ? (
                            <FinalRanking
                              phase={phase}
                              expandedPhases={expandedPhases}
                              onShrink={() => onShrink(phase.id)}
                              onExpand={() => onExpand(phase.id)}
                              onOpenAlertDialog={onOpenAlertDialog}
                              prerankPhaseId={prerankPhase.phaseId}
                              update={update}
                            ></FinalRanking>
                          ) : (
                            <PhaseAccordionDnD
                              phase={phase}
                              update={getData}
                              handleDeleteTeam={handleDeleteTeam}
                              expandedPhases={expandedPhases}
                              onShrink={() => onShrink(phase.id)}
                              onExpand={() => onExpand(phase.id)}
                              startPhase={startPhase}
                              onOpenDeleteDialog={onOpenDeleteDialog}
                            ></PhaseAccordionDnD>
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <AddPhase isOpen={openPhase} onClose={closePhaseDialog} update={update}></AddPhase>
      <AlertDialog
        open={openAlertDialog}
        onCancel={onCloseAlertDialog}
        onSubmit={endPhase}
        description={t('end_phase_warning')}
        title={t('end_phase_warning_title')}
      ></AlertDialog>
      <AlertDialog
        open={openDeleteDialog}
        onCancel={onCloseDeleteDialog}
        onSubmit={handleDeletePhase}
        description={t('delete.delete_phase_warning')}
        title={t('delete.delete') + ' ' + phaseToDelete.content}
      ></AlertDialog>
    </div>
  );
}
