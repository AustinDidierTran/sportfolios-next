import React, { useState, useEffect, useContext } from 'react';
import api from '../../actions/api';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import PhaseAccordionDnD from './PhaseAccordionDnD';
import PrerankAccordionDnD from './PrerankAccordionDnd';
import FinalRanking from './FinalRanking';
import Button from '../../components/Custom/Button';
import AlertDialog from '../../components/Custom/Dialog/AlertDialog';
import AddPhase from '../EditSchedule/CreateSchedule/AddPhase';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ACTION_ENUM, Store } from '../../Store';
import { PHASE_STATUS_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../common/enums';
import { ERROR_ENUM } from '../../../common/errors';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  width: '100%',
});

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function EditRankings() {
  const { t } = useTranslation();
  const router = useRouter();
  const { dispatch } = useContext(Store);
  const { id: eventId } = router.query;

  const [phases, setPhases] = useState([]);
  const [preRanking, setPreRanking] = useState([]);
  const [expandedPhases, setExpandedPhases] = useState([]);

  const [phaseToEnd, setPhaseToEnd] = useState({});
  const [phaseToDelete, setPhaseToDelete] = useState({});

  const [openPhase, setOpenPhase] = useState(false);
  const [madeChanges, setMadeChanges] = useState(false);
  const [isOneExpanded, setIsOneExpanded] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (eventId) {
      getPreranking();
      getPhases();
    }
  }, [eventId]);

  useEffect(() => {
    if (expandedPhases.length) {
      setIsOneExpanded(true);
    } else {
      setIsOneExpanded(false);
    }
  }, [expandedPhases.length]);

  const getPreranking = async () => {
    const { data } = await api(
      formatRoute('/api/entity/rankings', null, {
        eventId,
      })
    );
    const ranking = data.map((d) => ({
      position: d.position,
      content: d.name,
      id: d.teamId,
    }));
    setPreRanking(ranking);
  };

  const getPhases = async () => {
    const { data } = await api(
      formatRoute('/api/entity/phases', null, {
        eventId,
      })
    );

    const allPhases = data
      .map((d) => ({
        content: d.name,
        phaseId: d.id,
        id: d.id,
        spots: d.spots,
        status: d.status,
        order: d.phase_order,
        ranking: d.ranking.map((r) => {
          if (r && r.roster_id) {
            return { ...r, id: r.roster_id, content: r.name };
          }
          return { ...r, isEmpty: true, id: uuidv4() };
        }),
      }))
      .sort((a, b) => a.order - b.order);
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
    const res = await api('/api/entity/teamPhase', {
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
    const rankings = phase.ranking.map((r) => r.roster_id);
    if (!rankings.includes(null) && phase.spots) {
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
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('empty_phase_spots_warning'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 2000,
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
    //nothing for now
    setOpenDeleteDialog(false);
  };

  const update = () => {
    getPhases();
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
          <div className={styles.buttonText}>{window.innerWidth < 600 ? t('add.add') : t('add.add_phase')}</div>
        </Button>
        <Button className={styles.button} onClick={handleUpdateOrder} endIcon="SaveIcon" disabled={!madeChanges}>
          <div className={styles.buttonText}>{window.innerWidth < 600 ? t('save') : t('save_phase_order')}</div>
        </Button>
      </div>
      <div className={styles.div}>
        <PrerankAccordionDnD
          title={t('preranking')}
          teams={preRanking}
          update={getPreranking}
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
                              onOpenDeleteDialog={onOpenDeleteDialog}
                            ></FinalRanking>
                          ) : (
                            <PhaseAccordionDnD
                              phase={phase}
                              update={getPhases}
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
