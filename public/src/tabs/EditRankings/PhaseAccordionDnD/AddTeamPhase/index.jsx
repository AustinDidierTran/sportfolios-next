import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { COMPONENT_TYPE_ENUM, PHASE_STATUS_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function AddTeamPhase(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, phaseId, update, initialPosition } = props;
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [open, setOpen] = useState(isOpen);
  const [allTeams, setAllTeams] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [allPhases, setAllPhases] = useState([]);

  useEffect(() => {
    setOpen(isOpen);
    getAllTeams();
    getAllOptions();
  }, [isOpen]);

  const validationSchema = yup.object().shape({
    position: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const getAllTeams = async () => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsAcceptedInfos', null, {
        eventId,
      })
    );
    const allTeams = data.map((t) => ({
      value: t.rosterId,
      display: t.name,
    }));
    setAllTeams(allTeams);
  };

  const getAllOptions = async () => {
    const { data } = await api(
      formatRoute('/api/entity/phases', null, {
        eventId,
      })
    );
    const allPhases = data
      .map((d) => ({
        content: d.name,
        phaseId: d.id,
        spots: d.spots,
        status: d.status,
        order: d.phase_order,
        ranking: d.ranking.map((r) => ({
          rosterId: r.roster_id,
          originPhase: r.origin_phase,
          originPosition: r.origin_position,
          currentPhase: r.current_phase,
          currentPhaseName: d.name,
          initialPosition: r.initial_position,
          finalPosition: r.final_position,
          rankingId: r.ranking_id,
          teamName: r.name,
          originPhaseName: r.phaseName,
        })),
      }))
      .sort((a, b) => a.order - b.order);

    const allRankings = allPhases.reduce((prev, curr) => {
      return prev.concat(curr.ranking);
    }, []);

    const rankingOptions = getRankingOptions(allRankings, allPhases);
    const teamOptions = getTeamOptions(allRankings);
    const allOptions = teamOptions.concat(rankingOptions).sort((a, b) => {
      if (a.index && b.index && a.phaseId === b.phaseId) {
        return a.index - b.index;
      }
    });
    setAllOptions(allOptions);
  };

  const getRankingOptions = (allRankings, allPhases) => {
    const allPositions = allRankings
      .filter((r) => r.currentPhase !== phaseId)
      .map((r) => {
        let name;
        if (allPhases.find((p) => p.phaseId === r.currentPhase).status === PHASE_STATUS_ENUM.DONE) {
          name = r.finalPosition.toString() + ' - ' + r.currentPhaseName + ' (' + r.teamName + ') ';
        }
        return {
          display: name
            ? name
            : r.teamName
            ? r.initialPosition.toString() + ' - ' + r.currentPhaseName + ' (' + r.teamName + ') '
            : r.initialPosition.toString() + ' - ' + r.currentPhaseName,
          value: r.rankingId,
          index: r.finalPosition ? r.finalPosition : r.initialPosition,
          phaseId: r.currentPhase,
        };
      })
      .filter((o) => o !== undefined);

    const unavailablePositions = allRankings
      .filter((r) => r.originPhase && r.originPosition)
      .map((r) => {
        const unavailablePosition = allRankings.find((rank) => {
          if (rank.currentPhase === r.originPhase) {
            if (rank.finalPosition === r.originPosition) {
              return rank;
            }
            if (rank.initialPosition === r.originPosition && !rank.finalPosition) {
              return rank;
            }
          }
        });
        return unavailablePosition.rankingId;
      })
      .filter((r) => r !== undefined);

    const filteredPositions = allPositions.filter((p) => !unavailablePositions.includes(p.value));
    return filteredPositions;
  };

  const getTeamOptions = (allRankings) => {
    const unavailableTeams = allRankings.map((r) => r.rosterId).filter((r) => r !== undefined);
    const filteredTeams = allTeams.filter((t) => !unavailableTeams.includes(t.value));
    return filteredTeams;
  };

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      position: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { position } = values;
      const select = allOptions.find((o) => o.value === position);
      const { status, data } = await api('/api/entity/updateTeamPhase', {
        method: 'PUT',
        body: JSON.stringify({
          eventId,
          id: position,
          initialPosition,
          phaseId,
          originPhase: select.phaseId,
          originPosition: select.index,
        }),
      });

      if (status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        onClose();
        resetForm();
      }
      update();
    },
  });

  const buttons = [
    {
      onClick: onFinish,
      name: t('finish'),
      color: 'default',
    },
    {
      type: 'submit',
      name: t('add.add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: allOptions,
      namespace: 'position',
      label: t('position'),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('add.add_position')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
