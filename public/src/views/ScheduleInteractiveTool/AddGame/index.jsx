import React, { useMemo } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { FormDialog } from '../../../components/Custom';
import { formatDate } from '../../../utils/stringFormats';
import moment from 'moment';
import * as yup from 'yup';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { eventId, isOpen, onClose, createCard, field, timeslot, teams, phases } = props;

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const description = useMemo(() => {
    return `${field?.name}, ${formatDate(moment(timeslot.date))}`;
  }, [field, timeslot]);

  const validationSchema = yup.object().shape({
    phase: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    team1: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    team2: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const sendToInteractiveTool = (values) => {
    const { phase, team1, team2 } = values;

    const game = {
      field_id: field.id,
      timeslot_id: timeslot.id,
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
    validationSchema: validationSchema,
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
      open={isOpen}
      title={t('create_a_game')}
      description={description}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
