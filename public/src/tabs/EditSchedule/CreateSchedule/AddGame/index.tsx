import React, { useState, useEffect, useContext } from 'react';
import { FormDialog } from '../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import {
  SEVERITY_ENUM,
  REQUEST_STATUS_ENUM,
  COMPONENT_TYPE_ENUM,
  PHASE_STATUS_ENUM,
} from '../../../../../common/enums';
import { getGameOptions } from '../../../Schedule/ScheduleFunctions';
import * as yup from 'yup';
import { Games } from '../../../../../../typescript/types';

interface IProps {
  games: Games[];
  isOpen: boolean;
  onClose: () => void;
  addTimeslotToGrid?: (data: any, realDate: number) => void;
  update: any;
  updateGames: () => Promise<void>;
}

interface IWithAllData {
  value: string;
  displayKey?: string;
  display?: string;
}

interface IPhases extends IWithAllData {
  status?: string;
}

interface IData {
  value: string;
  display: string;
}

interface IPositionOption {
  value: string;
  display: string;
  id: string;
  rosterId: string;
  originPhase: string;
  originPosition: string;
  currentPhase: string;
  initialPosition: number;
  finalPosition: number;
  rankingId: string;
  phaseName?: string;
  name?: string;
  teamName?: string;
}

interface GameOptions {
  timeSlots: IData[];
  teams: IWithAllData[];
  phases: IPhases[];
  fields: IWithAllData[];
  positions: IPositionOption[];
}

const AddGame: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { games, isOpen, onClose, update, updateGames } = props;
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [open, setOpen] = useState<boolean>(isOpen);
  const [gameOptions, setGameOptions] = useState<GameOptions>();
  const [firstPositionOptions, setFirstPositionOptions] = useState<IPositionOption[]>([]);
  const [secondPositionOptions, setSecondPositionOptions] = useState<IPositionOption[]>([]);
  const [fieldOptions, setFieldOptions] = useState<IWithAllData[]>([]);
  const [timeslotOptions, setTimeslotOptions] = useState<IData[]>([]);

  const getOptions = async (): Promise<void> => {
    const res = await getGameOptions(eventId, true, true);
    setGameOptions(res);
    setFieldOptions(res.fields);
    setTimeslotOptions(res.timeSlots);
    setFirstPositionOptions(res.positions);
    setSecondPositionOptions(res.positions);
  };

  useEffect((): void => {
    if (eventId) {
      getOptions();
    }
  }, [open, eventId]);

  useEffect((): void => {
    formik.resetForm();
    setOpen(isOpen);
  }, [isOpen]);

  const onFinish = (): void => {
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
        ranking1.currentPhase !== ranking2.currentPhase ||
        phase !== ranking1.currentPhase ||
        phase !== ranking2.currentPhase
      ) {
        formik.setFieldValue('position1', '');
        formik.setFieldValue('position2', '');
        setFirstPositionOptions(gameOptions.positions.filter((r) => r.currentPhase === phase));
        setSecondPositionOptions(gameOptions.positions.filter((r) => r.currentPhase === phase));
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
      if (res.status === REQUEST_STATUS_ENUM.ERROR || res.status === REQUEST_STATUS_ENUM.UNAUTHORIZED) {
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
      const unavailableTime = games.filter((g) => g.fieldId === field).map((g) => g.timeslotId);
      const filteredTimeOptions = gameOptions.timeSlots.filter(
        (t) => t.value !== time && !unavailableTime.includes(t.value)
      );

      formik.setFieldValue('time', filteredTimeOptions.length ? filteredTimeOptions[0].value : '');
      setTimeslotOptions(filteredTimeOptions);
      updateGames();
      update();
    },
  });

  useEffect((): void => {
    if (formik.values.phase !== '' && formik.values.position1 === '' && formik.values.position2 === '') {
      formik.setFieldValue('position1', '');
      formik.setFieldValue('position2', '');
      const positions = gameOptions.positions.filter((p) => p.currentPhase === formik.values.phase);
      setFirstPositionOptions(positions);
      setSecondPositionOptions(positions);
    }
  }, [formik.values.phase]);

  useEffect((): void => {
    if (formik.values.position1 !== '' && formik.values.position2 === '') {
      const [{ currentPhase: phase }] = gameOptions.positions.filter((r) => r.value === formik.values.position1);
      const samePhaseRankings = gameOptions.positions.filter(
        (r) => r.value !== formik.values.position1 && r.currentPhase === phase
      );
      setSecondPositionOptions(samePhaseRankings);
    }
    if (formik.values.position2 !== '' && formik.values.position1 === '') {
      const [{ currentPhase: phase }] = gameOptions.positions.filter((r) => r.value === formik.values.position2);
      const samePhaseRankings = gameOptions.positions.filter(
        (r) => r.value !== formik.values.position2 && r.currentPhase === phase
      );
      setFirstPositionOptions(samePhaseRankings);
    }
    if (formik.values.position2 !== '' && formik.values.position1 !== '') {
      if (formik.values.phase === '') {
        const [{ currentPhase: phase }] = gameOptions.positions.filter((r) => r.value === formik.values.position1);
        formik.setFieldValue('phase', phase);
        return;
      }
      const firstPosition = gameOptions.positions.filter(
        (p) => p.value !== formik.values.position2 && p.currentPhase === formik.values.phase
      );
      const secondPosition = gameOptions.positions.filter(
        (p) => p.value !== formik.values.position1 && p.currentPhase === formik.values.phase
      );
      setFirstPositionOptions(firstPosition);
      setSecondPositionOptions(secondPosition);
    }
  }, [formik.values.position1, formik.values.position2]);

  useEffect((): void => {
    const unavailableTimeSlot = games.filter((g) => g.fieldId === formik.values.field).map((g) => g.timeslotId);
    setTimeslotOptions(gameOptions?.timeSlots?.filter((t) => !unavailableTimeSlot.includes(t.value)));
  }, [formik.values.field, formik.values.time]);

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
      options: fieldOptions,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'time',
      label: t('time_slot'),
      options: timeslotOptions,
    },
    {
      componentType: COMPONENT_TYPE_ENUM.SELECT,
      namespace: 'phase',
      label: t('phase'),
      options: gameOptions?.phases,
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
};
export default AddGame;
