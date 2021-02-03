import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { FormDialog } from '../../../components/Custom';
import { Store, ACTION_ENUM } from '../../../Store';
import api from '../../../actions/api';
import { formatDate } from '../../../utils/stringFormats';
import moment from 'moment';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);
  const { eventId, isOpen, onClose, createCard, field, timeslot, teams, phases } = props;

  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const description = useMemo(() => {
    return `${field?.name}, ${formatDate(moment(timeslot.date))}`;
  }, [field, timeslot]);

  const validate = (values) => {
    const { phase, team1, team2 } = values;
    const errors = {};
    if (!phase.length) {
      errors.phase = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!team1.length) {
      errors.team1 = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    if (!team2.length) {
      errors.team2 = t(ERROR_ENUM.VALUE_IS_REQUIRED);
    }
    return errors;
  };

  const sendToInteractiveTool = (values) => {
    const { phase, team1, team2 } = values;
    const timeslotId = timeslot.id;
    const fieldId = field.id;

    const game = {
      field_id: fieldId,
      timeslot_id: timeslotId,
      teamsId: [team1, team2],
      phase_id: phase,
    };

    createCard(game);
    onFinish();
  };

  const formik = useFormik({
    initialValues: {
      phase: '',
      team1: '',
      team2: '',
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: sendToInteractiveTool,
  });

  const buttons = [
    {
      onClick: onFinish,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: phases,
      namespace: 'phase',
      label: t('phase'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: teams,
      namespace: 'team1',
      label: t('team_1'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: teams,
      namespace: 'team2',
      label: t('team_2'),
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('create_a_game')}
      description={description}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
