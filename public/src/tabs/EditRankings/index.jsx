import React, { useState, useEffect, useContext } from 'react';
import api from '../../actions/api';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import PhaseAccordionDnD from './PhaseAccordionDnD';
import PrerankAccordionDnD from './PrerankAccordionDnd';
import Button from '../../components/Custom/Button';
import AddPhase from '../EditSchedule/CreateSchedule/AddPhase';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ACTION_ENUM, Store } from '../../Store';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../common/enums';
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

  const [openPhase, setOpenPhase] = useState(false);
  const [madeChanges, setMadeChanges] = useState(false);

  useEffect(() => {
    if (eventId) {
      getPreranking();
      getPhases();
    }
  }, [eventId]);

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
        id: d.id,
        spots: d.spots,
        isDone: d.is_done,
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
    setMadeChanges(true);
  };

  const onDragEnd = (result) => {
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

  return (
    <div className={styles.main}>
      <div className={styles.buttonContainer}>
        <Button className={styles.button} onClick={openPhaseDialog} endIcon="Add">
          {t('add.add_phase')}
        </Button>
        <Button className={styles.button} onClick={handleUpdateOrder} endIcon="SaveIcon" disabled={!madeChanges}>
          {t('save_phase_order')}
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
                  <Draggable key={phase.id} draggableId={phase.id} index={index} className={styles.draggable}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <div className={styles.div} key={phase.id}>
                          <PhaseAccordionDnD
                            title={phase.content}
                            teams={phase.ranking}
                            isDone={phase.isDone}
                            spots={phase.spots}
                            order={phase.order}
                            update={getPhases}
                            phaseId={phase.id}
                          ></PhaseAccordionDnD>
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
    </div>
  );
}
