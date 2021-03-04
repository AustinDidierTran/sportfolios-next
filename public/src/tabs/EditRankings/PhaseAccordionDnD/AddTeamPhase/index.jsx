import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { formatRoute } from '../../../../../common/utils/stringFormat';

export default function AddTeamPhase(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, phaseId, update, initialPosition, teams } = props;
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [open, setOpen] = useState(isOpen);
  const [allTeams, setAllTeams] = useState([]);
  const [onlyNonSelectedTeams, setOnlyNotSelectedTeams] = useState([]);
  const [poolOptions, setPoolOptions] = useState([]);
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    setOpen(isOpen);
    getAllTeams();
    getPhases();
  }, [isOpen]);

  const validationSchema = yup.object().shape({
    team: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
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
        spots: d.spots,
        status: d.status,
        order: d.phase_order,
        ranking: d.ranking.map((r) => {
          if (r && r.roster_id) {
            return { id: r.roster_id };
          }
          return { id: null };
        }),
      }))
      .sort((a, b) => a.order - b.order);
    setPhases(allPhases);
    getNonSelectedTeams(allPhases);
  };

  const getNonSelectedTeams = (allPhases) => {
    const rankings = allPhases
      .reduce((prev, curr) => {
        let ranking = prev.concat(curr.ranking);
        return ranking;
      }, [])
      .filter((r) => r.id !== null);

    const rankingsIds = rankings.map((r) => {
      return r.id;
    });
    const teamOptions = allTeams.filter((t) => !rankingsIds.includes(t.value));
    setOnlyNotSelectedTeams(teamOptions);
  };

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const formik = useFormik({
    initialValues: {
      team: '',
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { team } = values;

      const { status, data } = await api('/api/entity/updateTeamPhase', {
        method: 'PUT',
        body: JSON.stringify({
          eventId,
          team,
          initialPosition,
          phaseId,
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
      options: onlyNonSelectedTeams,
      namespace: 'team',
      label: t('team.team'),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('add.add_team')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
