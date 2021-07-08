import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, PHASE_STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import FormDialog from '../../../components/Custom/FormDialog';
import { formatDate } from '../../../utils/stringFormats';
import moment from 'moment';
import * as yup from 'yup';
import { Store, ACTION_ENUM } from '../../../Store';
import { haveDifferentPhase } from './AddGame.utils';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { isOpen, onClose, createCard, field, timeslot, rankings, phases } = props;
  const [firstPositionOptions, setFirstPositionOptions] = useState([]);
  const [secondPositionOptions, setSecondPositionOptions] = useState([]);

  useEffect(() => {
    setFirstPositionOptions(rankings);
    setSecondPositionOptions(rankings);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const description = useMemo(() => {
    return `${field?.name}, ${formatDate(moment.utc(timeslot.date))}`;
  }, [field, timeslot]);

  const validationSchema = yup.object().shape({
    phase: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    position1: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    position2: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const sendToInteractiveTool = (values) => {
    const { phase, position1, position2 } = values;
    const [ranking1] = rankings.filter((r) => r.rankingId === position1);
    const [ranking2] = rankings.filter((r) => r.rankingId === position2);
    const [selectedPhase] = phases.filter((p) => p.value === phase);
    if (position1 === position2) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_have_same_positions'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    if (haveDifferentPhase(ranking1, ranking2, phase)) {
      formik.setFieldValue('position1', '');
      formik.setFieldValue('position2', '');
      setFirstPositionOptions(rankings.filter((r) => r.currentPhase === phase));
      setSecondPositionOptions(rankings.filter((r) => r.currentPhase === phase));
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('cant_have_different_phase'),
        severity: SEVERITY_ENUM.ERROR,
        duration: 4000,
      });
      return;
    }
    //if phase is started, the name is overwritten to the team in that ranking
    if (selectedPhase.status !== PHASE_STATUS_ENUM.NOT_STARTED) {
      ranking1.name = ranking1.teamName;
      ranking2.name = ranking2.teamName;
    }
    const game = {
      fieldId: field.id,
      timeslotId: timeslot.id,
      rankings: [ranking1, ranking2],
      phaseId: phase,
    };

    createCard(game);
    onFinish();
  };

  const formik = useFormik({
    initialValues: {
      phase: '',
      position1: '',
      position2: '',
    },
    validationSchema,
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
      name: t('add.add'),
      color: 'primary',
    },
  ];

  useEffect(() => {
    if (formik.values.phase !== '' && formik.values.position1 === '' && formik.values.position2 === '') {
      formik.setFieldValue('position1', '');
      formik.setFieldValue('position2', '');
      const positions = rankings.filter((p) => p.currentPhase === formik.values.phase);
      setFirstPositionOptions(positions);
      setSecondPositionOptions(positions);
    }
  }, [formik.values.phase]);

  useEffect(() => {
    //TODO: refine the filter. Some flows can make it bug i.e. no position options available
    if (formik.values.position1 !== '' && formik.values.position2 === '') {
      const [{ currentPhase: phase }] = rankings.filter((r) => r.value === formik.values.position1);
      const samePhaseRankings = rankings.filter((r) => r.value !== formik.values.position1 && r.currentPhase === phase);
      setSecondPositionOptions(samePhaseRankings);
    }
    if (formik.values.position2 !== '' && formik.values.position1 === '') {
      const [{ currentPhase: phase }] = rankings.filter((r) => r.value === formik.values.position2);
      const samePhaseRankings = rankings.filter((r) => r.value !== formik.values.position2 && r.currentPhase === phase);
      setFirstPositionOptions(samePhaseRankings);
    }
    if (formik.values.position2 !== '' && formik.values.position1 !== '') {
      if (formik.values.phase === '') {
        const [{ currentPhase: phase }] = rankings.filter((r) => r.value === formik.values.position1);
        formik.setFieldValue('phase', phase);
        return;
      }
      const firstPosition = rankings.filter(
        (p) => p.value !== formik.values.position2 && p.currentPhase === formik.values.phase
      );
      const secondPosition = rankings.filter(
        (p) => p.value !== formik.values.position1 && p.currentPhase === formik.values.phase
      );
      setFirstPositionOptions(firstPosition);
      setSecondPositionOptions(secondPosition);
    }
  }, [formik.values.position1, formik.values.position2]);

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: phases,
      namespace: 'phase',
      label: t('phase'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: firstPositionOptions,
      namespace: 'position1',
      label: 'Position 1',
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      options: secondPositionOptions,
      namespace: 'position2',
      label: 'Position 2',
    },
  ];

  return (
    <FormDialog
      open={isOpen}
      title={t('create.create_a_game')}
      description={description}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
