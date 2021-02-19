import React, { useState, useEffect, useContext } from 'react';
import api from '../../actions/api';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { ACTION_ENUM, Store } from '../../Store';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../common/enums';
import { ERROR_ENUM } from '../../../common/errors';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import PhaseAccordionDnD from '../../components/Custom/AccordionDnD/PhaseAccordionDnD';
import PrerankAccordionDnD from '../../components/Custom/AccordionDnD/PrerankAccordionDnd';
import CustomButton from '../../components/Custom/Button';
import AddPhase from '../EditSchedule/CreateSchedule/AddPhase';
import EditPhase from './EditPhase';

export default function EditRankings() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;
  const { dispatch } = useContext(Store);

  const [items, setItems] = useState([]);
  const [phases, setPhases] = useState([]);
  const [teams, setTeams] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [phaseToEdit, setPhaseToEdit] = useState({});

  const [openPhase, setOpenPhase] = useState(false);
  const [editPhase, setEditPhase] = useState(false);

  useEffect(() => {
    getPreranking();
    getPhases();
    // getPhaseRankings();
  }, []);

  const addToEditRankings = () => {
    getPhases();
  };

  const updatePhase = () => {
    getPhases();
  };

  const getPreranking = async () => {
    const { data } = await api(
      formatRoute('/api/entity/rankings', null, {
        eventId,
      })
    );
    const ranking = data
      .map((d) => ({
        position: d.initial_position,
        content: d.name,
        id: d.team_id,
      }))
      .sort((a, b) => a.position - b.position)
      .map((m, index) => {
        if (!m.position) {
          m.position = index + 1;
        }
        return m;
      });

    const teams = data.map((d) => ({
      id: d.team_id,
      content: d.name,
    }));

    setTeams(teams);
    setItems(ranking);
  };

  const getPhases = async () => {
    const { data } = await api(
      formatRoute('/api/entity/phases', null, {
        eventId,
      })
    );

    const allPhases = data.map((d) => ({ content: d.name, id: d.id, spots: d.spots, isDone: d.is_done }));
    setPhases(allPhases);

    getPhaseRankings(allPhases);
  };

  //TODO: mettre le bon nom de team si roster_id est présent (faut aller fetch le roster)
  const getPhaseRankings = async (allPhases) => {
    const res = allPhases.map(async (p) => {
      const phaseId = p.id;
      const { data } = await api(
        formatRoute('/api/entity/phaseRankings', null, {
          phaseId,
        }),
        { method: 'GET' }
      );
      return { ...data, initialPos: data.initial_position, content: data.roster_id ? roster_id : t('add_team') };
    });

    setRankings(res);
  };

  const onSave = async (items) => {
    const res = await api(`/api/entity/updatePreRanking`, {
      method: 'PUT',
      body: JSON.stringify({
        eventId,
        ranking: items,
      }),
    });
    if (res.status === STATUS_ENUM.SUCCESS) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('preranking_saved'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: ERROR_ENUM.ERROR_OCCURED,
        severity: SEVERITY_ENUM.ERROR,
      });
    }
  };

  const onCancel = () => {
    getPreranking();
  };

  const onEditNumberOfTeams = () => {
    console.log('pressed');
  };

  const onEditTeam = (item) => {
    console.log('editing team: ' + item.content);
  };

  const onAddTeam = () => {
    console.log('add team');
  };

  const openPhaseDialog = () => {
    setOpenPhase(true);
  };

  const closePhaseDialog = () => {
    setOpenPhase(false);
  };

  const openEditPhaseDialog = (items, id) => {
    const phase = phases.find((p) => p.id === id);
    setPhaseToEdit(phase);
    setEditPhase(true);
  };

  const closeEditPhaseDialog = () => {
    setEditPhase(false);
    setPhaseToEdit({});
  };

  const buttons = [
    {
      onClick: openEditPhaseDialog,
      name: t('edit_team_number'),
      color: 'primary',
      endIcon: 'Edit',
    },
    {
      onClick: onSave,
      name: t('save'),
      color: 'primary',
      endIcon: 'SaveIcon',
    },
    {
      onClick: onCancel,
      name: t('cancel'),
      color: 'secondary',
      endIcon: 'Close',
    },
  ];

  const prerankingButtons = [
    {
      onClick: onSave,
      name: t('save'),
      color: 'primary',
      endIcon: 'SaveIcon',
    },
    {
      onClick: onCancel,
      name: t('cancel'),
      color: 'secondary',
      endIcon: 'Close',
    },
  ];

  const editIconButton = {
    onClick: onEditTeam,
  };

  const addIconButton = {
    onClick: onAddTeam,
  };

  return (
    <>
      <div className={styles.buttonContainer}>
        <CustomButton className={styles.button} onClick={openPhaseDialog} endIcon="Add">
          {t('add_phase')}
        </CustomButton>
      </div>
      <div className={styles.div}>
        <PrerankAccordionDnD
          title={t('preranking')}
          teams={teams}
          buttons={prerankingButtons}
          editIconButton={editIconButton}
          id={'preranking'}
          isDone={false}
        ></PrerankAccordionDnD>
      </div>
      <div>
        {phases.map((p) => (
          <div className={styles.div} key={p.id}>
            <PhaseAccordionDnD
              title={p.content}
              items={items}
              withIndex
              buttons={buttons}
              editIconButton={editIconButton}
              addIconButton={addIconButton}
              isDone={p.isDone}
              spots={p.spots}
              id={p.id}
            ></PhaseAccordionDnD>
          </div>
        ))}
      </div>
      <AddPhase isOpen={openPhase} onClose={closePhaseDialog} addToEditRankings={addToEditRankings}></AddPhase>
      <EditPhase
        isOpen={editPhase}
        onClose={closeEditPhaseDialog}
        phaseId={phaseToEdit.id}
        currentSpots={phaseToEdit.spots}
        updatePhase={updatePhase}
      ></EditPhase>
    </>
  );
}
