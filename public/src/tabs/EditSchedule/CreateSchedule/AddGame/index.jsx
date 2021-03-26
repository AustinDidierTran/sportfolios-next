import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, STATUS_ENUM, COMPONENT_TYPE_ENUM, PHASE_STATUS_ENUM } from '../../../../../common/enums';
import { getFutureGameOptions } from '../../../Schedule/ScheduleFunctions';
import { useRouter } from 'next/router';
import * as yup from 'yup';

export default function AddGame(props) {
  const { t } = useTranslation();
  const { isOpen, onClose, update } = props;
  const { dispatch } = useContext(Store);
  const router = useRouter();
  const { id: eventId } = router.query;

  const [open, setOpen] = useState(isOpen);
  const [gameOptions, setGameOptions] = useState({});
  const [firstPositionOptions, setFirstPositionOptions] = useState([]);
  const [secondPositionOptions, setSecondPositionOptions] = useState([]);

  const getOptions = async () => {
    const res = await getFutureGameOptions(eventId, {
      withoutAll: true,
    });
    setGameOptions(res);
    setFirstPositionOptions(res.positions);
    setSecondPositionOptions(res.positions);
  };

  useEffect(() => {
    getOptions();
  }, [open]);

  useEffect(() => {
    formik.resetForm();
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = () => {
    formik.resetForm();
    onClose();
  };

  const validationSchema = yup.object().shape({
    field: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    time: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    phase: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    position1: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    position2: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      phase: '',
      field: '',
      time: '',
      position1: '',
      position2: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { phase, field, time, position1, position2 } = values;
      const [ranking1] = gameOptions.positions.filter((p) => p.value === position1);
      const [ranking2] = gameOptions.positions.filter((p) => p.value === position2);
      const [selectedPhase] = gameOptions.phases.filter((p) => p.value === phase);
      if (position1 === position2) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('cant_have_same_positions'),
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      }
      if (
        ranking1.current_phase !== ranking2.current_phase ||
        phase !== ranking1.current_phase ||
        phase !== ranking2.current_phase
      ) {
        formik.setFieldValue('position1', '');
        formik.setFieldValue('position2', '');
        setFirstPositionOptions(gameOptions.positions.filter((r) => r.current_phase === phase));
        setSecondPositionOptions(gameOptions.positions.filter((r) => r.current_phase === phase));
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
      const res = await api('/api/entity/game', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          phaseId: phase,
          fieldId: field,
          timeslotId: time,
          rankingId1: position1,
          rankingId2: position2,
        }),
      });
      if (res.status === STATUS_ENUM.ERROR || res.status === STATUS_ENUM.UNAUTHORIZED) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
        return;
      }
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('game_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });

      update();
    },
  });

  useEffect(() => {
    if (formik.values.phase !== '' && formik.values.position1 === '' && formik.values.position2 === '') {
      formik.setFieldValue('position1', '');
      formik.setFieldValue('position2', '');
      const positions = gameOptions.positions.filter((p) => p.current_phase === formik.values.phase);
      setFirstPositionOptions(positions);
      setSecondPositionOptions(positions);
    }
  }, [formik.values.phase]);

  useEffect(() => {
    //TODO: refine the filter. Some flows can make it bug i.e. no position options available
    if (formik.values.position1 !== '' && formik.values.position2 === '') {
      const [{ current_phase: phase }] = gameOptions.positions.filter((r) => r.value === formik.values.position1);
      const samePhaseRankings = gameOptions.positions.filter(
        (r) => r.value !== formik.values.position1 && r.current_phase === phase
      );
      setSecondPositionOptions(samePhaseRankings);
    }
    if (formik.values.position2 !== '' && formik.values.position1 === '') {
      const [{ current_phase: phase }] = gameOptions.positions.filter((r) => r.value === formik.values.position2);
      const samePhaseRankings = gameOptions.positions.filter(
        (r) => r.value !== formik.values.position2 && r.current_phase === phase
      );
      setFirstPositionOptions(samePhaseRankings);
    }
    if (formik.values.position2 !== '' && formik.values.position1 !== '') {
      if (formik.values.phase === '') {
        const [{ current_phase: phase }] = gameOptions.positions.filter((r) => r.value === formik.values.position1);
        formik.setFieldValue('phase', phase);
        return;
      }
      const firstPosition = gameOptions.positions.filter(
        (p) => p.value !== formik.values.position2 && p.current_phase === formik.values.phase
      );
      const secondPosition = gameOptions.positions.filter(
        (p) => p.value !== formik.values.position1 && p.current_phase === formik.values.phase
      );
      setFirstPositionOptions(firstPosition);
      setSecondPositionOptions(secondPosition);
    }
  }, [formik.values.position1, formik.values.position2]);

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
      namespace: 'field',
      label: t('field'),
      options: gameOptions.fields,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'time',
      label: t('time_slot'),
      options: gameOptions.timeSlots,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'phase',
      label: t('phase'),
      options: gameOptions.phases,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'position1',
      label: 'Position 1',
      options: firstPositionOptions,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'position2',
      label: 'Position 2',
      options: secondPositionOptions,
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('create.create_a_game')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
