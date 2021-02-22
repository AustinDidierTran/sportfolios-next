import React, { useState, useEffect } from 'react';
import api from '../../actions/api';
import styles from './EditRankings.module.css';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../common/utils/stringFormat';
import PhaseAccordionDnD from './PhaseAccordionDnD';
import PrerankAccordionDnD from './PrerankAccordionDnd';
import CustomButton from '../../components/Custom/Button';
import AddPhase from '../EditSchedule/CreateSchedule/AddPhase';
import { v4 as uuidv4 } from 'uuid';

export default function EditRankings() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;

  const [phases, setPhases] = useState([]);
  const [preRanking, setPreRanking] = useState([]);

  const [openPhase, setOpenPhase] = useState(false);

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

    const allPhases = data.map((d) => ({
      content: d.name,
      id: d.id,
      spots: d.spots,
      isDone: d.is_done,
      ranking: d.ranking.map((r) => {
        if (r && r.roster_id) {
          return { ...r, id: r.roster_id, content: r.name };
        }
        return { ...r, isEmpty: true, id: uuidv4() };
      }),
    }));
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
        <CustomButton className={styles.button} onClick={openPhaseDialog} endIcon="Add">
          {t('add.add_phase')}
        </CustomButton>
      </div>
      <div className={styles.div}>
        <PrerankAccordionDnD
          title={t('preranking')}
          teams={preRanking}
          update={getPreranking}
          id={'preranking'}
          eventId={eventId}
        ></PrerankAccordionDnD>
      </div>
      <div>
        {phases.map((p) => (
          <div className={styles.div} key={p.id}>
            <PhaseAccordionDnD
              title={p.content}
              teams={p.ranking}
              isDone={p.isDone}
              spots={p.spots}
              update={getPhases}
              phaseId={p.id}
              handleDeleteTeam={handleDeleteTeam}
            ></PhaseAccordionDnD>
          </div>
        ))}
      </div>
      <AddPhase isOpen={openPhase} onClose={closePhaseDialog} update={update}></AddPhase>
    </div>
  );
}
