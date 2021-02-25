import React, { useState, useEffect, useContext } from 'react';
import api from '../../actions/api';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import PhaseAccordionDnD from './PhaseAccordionDnD';
import PrerankAccordionDnD from './PrerankAccordionDnd';
import StartedPhase from './StartedPhase';
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

  const [openPhase, setOpenPhase] = useState(false);
  const [madeChanges, setMadeChanges] = useState(false);
  const [isOneExpanded, setIsOneExpanded] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

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

  const update = () => {
    getPhases();
  };

  const openPhaseDialog = () => {
    setOpenPhase(true);
  };

  const closePhaseDialog = () => {
    setOpenPhase(false);
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

  const startPhase = async (phase) => {
    if (phase.spots) {
      const rankings = phase.ranking.map((r) => r.roster_id);
      if (!rankings.includes(null)) {
        const res = await api('/api/entity/updatePhase', {
          method: 'PUT',
          body: JSON.stringify({
            eventId,
            phaseId: phase.phaseId,
            status: PHASE_STATUS_ENUM.STARTED,
          }),
        });
        update();
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('empty_phase_spots_warning'),
          severity: SEVERITY_ENUM.ERROR,
          duration: 2000,
        });
      }
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
      }),
    });
    update();
    setOpenAlertDialog(false);
  };

  const onCloseAlertDialog = () => {
    setOpenAlertDialog(false);
  };

  const onOpenAlertDialog = (phase) => {
    setPhaseToEnd(phase);
    setOpenAlertDialog(true);
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
                          {phase.status === PHASE_STATUS_ENUM.DONE ? (
                            <FinalRanking
                              phase={phase}
                              expandedPhases={expandedPhases}
                              setExpandedPhases={setExpandedPhases}
                              isOneExpanded={isOneExpanded}
                            ></FinalRanking>
                          ) : phase.status === PHASE_STATUS_ENUM.STARTED ? (
                            <StartedPhase
                              phase={phase}
                              isOneExpanded={isOneExpanded}
                              expandedPhases={expandedPhases}
                              setExpandedPhases={setExpandedPhases}
                              onOpenAlertDialog={onOpenAlertDialog}
                            ></StartedPhase>
                          ) : (
                            <PhaseAccordionDnD
                              phase={phase}
                              update={getPhases}
                              handleDeleteTeam={handleDeleteTeam}
                              expandedPhases={expandedPhases}
                              setExpandedPhases={setExpandedPhases}
                              isOneExpanded={isOneExpanded}
                              startPhase={startPhase}
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
    </div>
  );
}
