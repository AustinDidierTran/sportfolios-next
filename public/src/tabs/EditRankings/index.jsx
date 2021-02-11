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
import CustomButton from '../../components/Custom/Button';
import AddPhase from '../EditSchedule/CreateSchedule/AddPhase';

export default function EditRankings() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id: eventId } = router.query;
  const { dispatch } = useContext(Store);

  const [items, setItems] = useState([]);
  const [phases, setPhases] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    getRankings();
  }, []);

  useEffect(() => {
    getPhases();
  }, []);

  useEffect(() => {
    getPhases();
  }, [phases]);

  const getRankings = async () => {
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
    //A ajouter : nbde places dispos dans le pool
    const phases = data.map((d) => ({ content: d.name, id: d.id }));

    setPhases(phases);
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
    getRankings();
  };

  const onEditTeamNumber = () => {
    console.log('pressed');
  };

  const onEditTeam = (item) => {
    console.log('editing team: ' + item.content);
  };

  const buttons = [
    {
      onClick: onEditTeamNumber,
      name: t('edit_team_number'),
      color: 'primary',
      endIcon: 'Add',
    },
    {
      onClick: onSave,
      name: t('save'),
      color: 'primary',
      endIcon: 'Check',
    },
    {
      onClick: onCancel,
      name: t('cancel'),
      color: 'secondary',
      endIcon: 'Close',
    },
  ];

  const iconButton = {
    onClick: onEditTeam,
  };

  return (
    <>
      <div className={styles.div}>
        <PhaseAccordionDnD title={t('preranking')} items={items} withIndex buttons={buttons}></PhaseAccordionDnD>
      </div>
      <div>
        {phases.map((p) => (
          <div className={styles.div} key={p.id}>
            <PhaseAccordionDnD
              title={p.content}
              items={teams}
              withIndex
              buttons={buttons}
              iconButton={iconButton}
            ></PhaseAccordionDnD>
          </div>
        ))}
      </div>
    </>
  );
}
