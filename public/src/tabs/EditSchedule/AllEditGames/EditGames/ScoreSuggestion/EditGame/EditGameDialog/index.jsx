import React, { useState, useEffect } from 'react';

import { FormDialog } from '../../../../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../../../../actions/api';
import { STATUS_ENUM, SEVERITY_ENUM, COMPONENT_TYPE_ENUM } from '../../../../../../../../common/enums';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../../../common/errors';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../../../../../Store';
import { getGameOptions } from '../../../../../../Schedule/ScheduleFunctions';
import * as yup from 'yup';

export default function EditGameDialog(props) {
  const { game, update, open, onClose } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [edit, setEdit] = useState(open);
  const [gameOptions, setGameOptions] = useState({});
  const [firstPositionOptions, setFirstPositionOptions] = useState([]);
  const [secondPositionOptions, setSecondPositionOptions] = useState([]);
  const [originalOptions, setOriginalOptions] = useState([]);

  const oldRanking1 = game.positions[0];
  const oldRanking2 = game.positions[1];

  const getOptions = async () => {
    const res = await getGameOptions(eventId, t);
    setGameOptions(res);
    setFirstPositionOptions(res.positions.filter((p) => p.current_phase === game.phase_id));
    setSecondPositionOptions(res.positions.filter((p) => p.current_phase === game.phase_id));
    setOriginalOptions(res.positions.filter((p) => p.current_phase === game.phase_id));
  };

  useEffect(() => {
    if (eventId) {
      getOptions();
    }
  }, [edit, eventId]);

  useEffect(() => {
    setEdit(open);
  }, [open]);

  const closeEdit = () => {
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
      description: game.description ? game.description : '',
      phase: game.phase_id,
      field: game.field_id,
      time: game.timeslot_id,
      position1: game.positions[0].ranking_id,
      position2: game.positions[1].ranking_id,
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { phase, field, time, position1, position2, description } = values;
      const res = await api('/api/entity/game', {
        method: 'PUT',
        body: JSON.stringify({
          gameId: game.id,
          phaseId: phase,
          fieldId: field,
          timeslotId: time,
          rankingId1: position1,
          rankingId2: position2,
          oldRanking1,
          oldRanking2,
          description,
        }),
      });
      if (res.status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('game_updated'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 4000,
        });
        update();
        onClose();
      }
    },
  });

  useEffect(() => {
    if (formik.values.phase !== game.phase_id) {
      formik.setFieldValue('position1', '');
      formik.setFieldValue('position2', '');
      const positions = gameOptions.positions.filter((p) => p.current_phase === formik.values.phase);
      setFirstPositionOptions(positions);
      setSecondPositionOptions(positions);
    } else {
      if (
        formik.values.position1 !== game.positions[0].ranking_id &&
        formik.values.position2 !== game.positions[1].ranking_id
      ) {
        formik.setFieldValue('position1', '');
        formik.setFieldValue('position2', '');
      }
      setFirstPositionOptions(originalOptions);
      setSecondPositionOptions(originalOptions);
    }
  }, [formik.values.phase]);

  useEffect(() => {
    if (formik.values.position1 !== '' && formik.values.position2 === '') {
      const positions = secondPositionOptions.filter((p) => p.value !== formik.values.position1);
      setSecondPositionOptions(positions);
    }
    if (formik.values.position2 !== '' && formik.values.position1 === '') {
      const positions = firstPositionOptions.filter((p) => p.value !== formik.values.position1);
      setFirstPositionOptions(positions);
    }
    if (
      formik.values.position2 !== '' &&
      formik.values.position1 !== '' &&
      formik.values.position1 !== game.positions[0].ranking_id &&
      formik.values.position2 !== game.positions[1].ranking_id
    ) {
      const firstPosition = gameOptions.positions.filter(
        (p) => p.value !== formik.values.position2 && p.current_phase === formik.values.phase
      );
      const secondPosition = gameOptions.positions.filter(
        (p) => p.value !== formik.values.position1 && p.current_phase === formik.values.phase
      );
      setFirstPositionOptions(firstPosition);
      setSecondPositionOptions(secondPosition);
    }
    if (formik.values.position2 === formik.values.position1) {
      formik.setFieldValue('position2', '');
    }
  }, [formik.values.position1, formik.values.position2]);

  const buttons = [
    {
      onClick: closeEdit,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('done'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.TEXTFIELD,
      namespace: 'description',
      label: t('description.description'),
    },
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
    <>
      <FormDialog
        open={edit}
        onClose={closeEdit}
        title={t('edit.edit_game')}
        fields={fields}
        formik={formik}
        buttons={buttons}
      ></FormDialog>
    </>
  );
}
