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
  const [availableTeams, setAvailableTeams] = useState([]);

  const validationSchema = yup.object().shape({
    team: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const getAvailableTeams = async () => {
    const { data } = await api(
      formatRoute('/api/entity/allTeamsRegisteredInfos', null, {
        eventId,
      })
    );

    const teamsIds = teams.map((t) => t.id);

    const allTeams = data.map((t) => ({
      value: t.rosterId,
      display: t.name,
    }));

    const availableTeams = allTeams.filter((t) => !teamsIds.includes(t.value));

    setAvailableTeams(availableTeams);
  };

  useEffect(() => {
    setOpen(isOpen);
    getAvailableTeams();
  }, [isOpen]);

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
      options: availableTeams,
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
