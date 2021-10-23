import React, { useState, useEffect, useContext } from 'react';

import api from '../../actions/api';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../utils/stringFormats';
import Button from '../../components/Custom/Button';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ACTION_ENUM, Store } from '../../Store';
import { PHASE_STATUS_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../common/enums';
import { ERROR_ENUM } from '../../../common/errors';
import dynamic from 'next/dynamic';
import { useWindowSize } from '../../hooks/window';
import { MOBILE_WIDTH } from '../../../common/constants';
import { getPhases, getPreranking, getPrerankPhase } from '../../actions/service/entity/get';
import { Phase, Preranking, Ranking } from '../../../../typescript/types';
import { ISpiritRanking } from '../../../../typescript/event';
import SpiritRanking from '../Rankings/SpiritRanking';
import { getEventRankings } from '../../actions/service/event';

const PhaseAccordionDnD = dynamic(() => import('./PhaseAccordionDnD'));
const PrerankAccordionDnD = dynamic(() => import('./PrerankAccordionDnd'));
const FinalRanking = dynamic(() => import('./FinalRanking'));
const AlertDialog = dynamic(() => import('../../components/Custom/Dialog/AlertDialog'));
const AddPhase = dynamic(() => import('./AddPhase'));

const getItemStyle = (draggableStyle: any) => ({
  userSelect: 'none',
  ...draggableStyle,
});

const getListStyle = () => ({
  width: '100%',
});

const reorder = (list: Phase[], startIndex: number, endIndex: number): Phase[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const EditRankings: React.FunctionComponent = () => {
  const [width] = useWindowSize();
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [phases, setPhases] = useState<Phase[]>([]);
  const [preranking, setPreranking] = useState<Preranking[]>();
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const [spiritRanking, setSpiritRanking] = useState<[ISpiritRanking]>();

  const [phaseToEnd, setPhaseToEnd] = useState<Phase>();
  const [phaseToDelete, setPhaseToDelete] = useState<Phase>();
  const [prerankPhase, setPrerankPhase] = useState<Phase>();

  const [openPhase, setOpenPhase] = useState<boolean>(false);
  const [madeChanges, setMadeChanges] = useState<boolean>(false);
  const [isOneExpanded, setIsOneExpanded] = useState<boolean>(false);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

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

  const getData = async (): Promise<void> => {
    const prerankPhase = await getPrerankPhase(eventId);
    setPrerankPhase(prerankPhase);

    const { spirit } = await getEventRankings(eventId);

    setSpiritRanking(spirit);

    const { preranking: ranking } = await getPreranking(eventId);
    const phases = await getPhases(eventId);

    let preranking: Preranking[] = [];

    if (ranking) {
      preranking = ranking.map((d) => ({
        position: d.position,
        content: d.noTeam ? t('register.register_team') : d.name,
        rosterId: d.rosterId ? d.rosterId : null,
        rankingId: d.rankingId,
      }));
    }

    console.log('austin2', { phases });
    const allPhases = phases
      .map((d) => ({
        content: d.name,
        phaseId: d.id,
        id: d.id,
        spots: d.spots,
        status: d.status,
        order: d.phaseOrder,
        type: d.type,
        ranking: d.ranking.map((r) => {
          console.log('austin1', { r });
          if (r && r.rosterId) {
            if (r.originPhase.id === prerankPhase.phaseId) {
              return {
                ...r,
                rankingId: r.rankingId,
                positionName: `${r.originPosition}. ${t('preranking')}`,
                name: r.name,
              };
            }
            return {
              ...r,
              rankingId: r.rankingId,
              positionName: `${r.originPosition}. ${r.originPhase.name}`,
              name: r.name,
            };
          }
          if (r && r.originPhase?.id && r.originPosition) {
            if (r.originPhase.id === prerankPhase.phaseId) {
              const rankingWithName = preranking.find((p) => p.position === r.originPosition);
              if (rankingWithName.rosterId) {
                return {
                  ...r,
                  rankingId: r.rankingId,
                  name: rankingWithName.content,
                  positionName: `${r.originPosition}. ${t('preranking')}`,
                };
              } else {
                return {
                  ...r,
                  rankingId: r.rankingId,
                  positionName: `${r.originPosition}. ${t('preranking')}`,
                };
              }
            }
            return { ...r, rankingId: r.rankingId, positionName: `${r.originPosition}. ${r.originPhase.name}` };
          }
          return { ...r, isEmpty: true, rankingId: r.rankingId };
        }),
      }))
      .sort((a, b) => a.order - b.order);

    setPreranking(preranking);
    setPhases(allPhases);
  };

  const handleUpdateOrder = async (): Promise<void> => {
    const res = await api('/api/entity/updatePhaseOrder', {
      method: 'PUT',
      body: JSON.stringify({
        orderedPhases: phases,
        eventId,
      }),
    });

    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
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

  const onDragEnd = (result: any): void => {
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

  const handleDeleteTeam = async (phaseId: string, position: number) => {
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

  const startPhase = (phase: Phase, event: any, madeChanges: boolean): void => {
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

  const phaseFilter = (phase: Phase, type: string): Ranking[] | string[] => {
    if (type == 'Phase') {
      return phase.ranking.filter((r) => r.originPhase.id && !r.rosterId);
    } else if (type == 'Prerank') {
      return phase.ranking.filter((r) => r.originPhase.id === prerankPhase.phaseId && !r.rosterId);
    } else if (type == 'Ranking') {
      return phase.ranking.filter((r) => !r.originPhase.id && !r.originPosition);
    } else {
      return phase.ranking.map((r) => r.rosterId);
    }
  };

  const handleStartPhase = async (phase: Phase) => {
    const rankingsFromPhase = phaseFilter(phase, 'Phase');
    const rankingsFromPrerank = phaseFilter(phase, 'Prerank');
    const emptyRankings = phaseFilter(phase, 'Ranking');
    const rankingsWithRosterId = phaseFilter(phase, '');

    if (!rankingsWithRosterId.some((r) => !r) && phase.spots !== 0) {
      const res = await api('/api/entity/updatePhase', {
        method: 'PUT',
        body: JSON.stringify({
          eventId,
          phaseId: phase.phaseId,
          type: phase.type,
          status: PHASE_STATUS_ENUM.STARTED,
        }),
      });
      if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
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

  const endPhase = async (): Promise<void> => {
    const res = await api('/api/entity/updatePhase', {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        phaseId: phaseToEnd.phaseId,
        status: PHASE_STATUS_ENUM.DONE,
        finalRanking: phaseToEnd.finalRanking,
      }),
    });
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
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

  const handleDeletePhase = async (): Promise<void> => {
    const res = await api(
      formatRoute('/api/entity/phase', null, {
        eventId: eventId,
        phaseId: phaseToDelete.id,
      }),
      {
        method: 'DELETE',
      }
    );
    if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
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

  const update = (): void => {
    getData();
  };

  const closePhaseDialog = (): void => {
    setOpenPhase(false);
  };

  const openPhaseDialog = (): void => {
    setOpenPhase(true);
  };

  const onCloseAlertDialog = (): void => {
    setOpenAlertDialog(false);
  };

  const onOpenAlertDialog = (phase: Phase, event: any, items: any): void => {
    event.preventDefault();
    setPhaseToEnd({ ...phase, finalRanking: items });
    setOpenAlertDialog(true);
  };

  const onCloseDeleteDialog = (): void => {
    setOpenDeleteDialog(false);
  };

  const onOpenDeleteDialog = (phase: Phase): void => {
    setPhaseToDelete(phase);
    setOpenDeleteDialog(true);
  };

  const onShrink = (phaseId: string): void => {
    setExpandedPhases((e) => e.filter((p) => p !== phaseId));
  };

  const onExpand = (phaseId: string): void => {
    setExpandedPhases([...expandedPhases, phaseId]);
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
        <PrerankAccordionDnD title={t('preranking')} ranking={preranking} update={getData} id={'preranking'} />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided: any) => (
            <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyle()}>
              <div>
                {phases.map((phase, index) => (
                  <Draggable key={phase.id} draggableId={phase.id} index={index} isDragDisabled={isOneExpanded}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(provided.draggableProps.style)}
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
                              preRanking={preranking}
                              update={update}
                            />
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
                            />
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
      <SpiritRanking spirit={spiritRanking} />
      <AddPhase isOpen={openPhase} onClose={closePhaseDialog} update={update}></AddPhase>
      <AlertDialog
        open={openAlertDialog}
        onCancel={onCloseAlertDialog}
        onSubmit={endPhase}
        description={t('end_phase_warning')}
        title={t('end_phase_warning_title')}
      />
      <AlertDialog
        open={openDeleteDialog}
        onCancel={onCloseDeleteDialog}
        onSubmit={handleDeletePhase}
        description={t('delete.delete_phase_warning')}
        title={t('delete.delete') + ' ' + phaseToDelete?.content}
      />
    </div>
  );
};

export default EditRankings;
