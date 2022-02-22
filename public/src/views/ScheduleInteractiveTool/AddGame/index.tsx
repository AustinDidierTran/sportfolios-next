import React, { useEffect, useMemo, useState, useContext } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, PHASE_STATUS_ENUM, SEVERITY_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { DialogPresentation } from '../../../components/Custom/FormDialog';
import { formatDate } from '../../../utils/stringFormats';
import moment from 'moment';
import * as yup from 'yup';
import { Store, ACTION_ENUM } from '../../../Store';
import { haveDifferentPhase } from './AddGame.utils';
import { Field, Game, Phase, Ranking, TimeSlot } from '../../../../../typescript/types';
import Select from '../../../components/Custom/Select';
import Button from '@material-ui/core/Button';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  createCard: (game: Game) => void;
  field: Field;
  timeslot: TimeSlot;
  rankings: IRankingOptions[];
  phases: IPhaseOptions[];
}

interface IRankingOptions extends Ranking {
  value: string;
  display: string;
}

interface IPhaseOptions extends Phase {
  value: string;
  display: string;
}

const AddGame: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const { isOpen, onClose, createCard, field, timeslot, rankings, phases } = props;
  const [firstPositionOptions, setFirstPositionOptions] = useState([]);
  const [secondPositionOptions, setSecondPositionOptions] = useState([]);

  useEffect((): void => {
    setFirstPositionOptions(rankings);
    setSecondPositionOptions(rankings);
  }, [isOpen]);

  const onFinish = (): void => {
    formik.resetForm();
    onClose();
  };

  const description = useMemo((): string => {
    return `${field?.name}, ${formatDate(moment.utc(timeslot.date))}`;
  }, [field, timeslot]);

  const validationSchema = yup.object().shape({
    phase: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    position1: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    position2: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const sendToInteractiveTool = (values: { phase: string; position1: string; position2: string }): void => {
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
    if (haveDifferentPhase(ranking1.currentPhase.id, ranking2.currentPhase.id, phase)) {
      formik.setFieldValue('position1', '');
      formik.setFieldValue('position2', '');
      setFirstPositionOptions(rankings.filter((r) => r.currentPhase.id === phase));
      setSecondPositionOptions(rankings.filter((r) => r.currentPhase.id === phase));
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

  useEffect((): void => {
    if (formik.values.phase !== '' && formik.values.position1 === '' && formik.values.position2 === '') {
      formik.setFieldValue('position1', '');
      formik.setFieldValue('position2', '');
      const positions = rankings.filter((p) => p.currentPhase.id === formik.values.phase);
      setFirstPositionOptions(positions);
      setSecondPositionOptions(positions);
    }
  }, [formik.values.phase]);

  useEffect((): void => {
    //TODO: refine the filter. Some flows can make it bug i.e. no position options available
    if (formik.values.position1 !== '' && formik.values.position2 === '') {
      const [{ currentPhase: phase }] = rankings.filter((r) => r.value === formik.values.position1);
      const samePhaseRankings = rankings.filter(
        (r) => r.value !== formik.values.position1 && r.currentPhase.id === phase.id
      );
      setSecondPositionOptions(samePhaseRankings);
    }
    if (formik.values.position2 !== '' && formik.values.position1 === '') {
      const [{ currentPhase: phase }] = rankings.filter((r) => r.value === formik.values.position2);
      const samePhaseRankings = rankings.filter(
        (r) => r.value !== formik.values.position2 && r.currentPhase.id === phase.id
      );
      setFirstPositionOptions(samePhaseRankings);
    }
    if (formik.values.position2 !== '' && formik.values.position1 !== '') {
      if (formik.values.phase === '') {
        const [{ currentPhase: phase }] = rankings.filter((r) => r.value === formik.values.position1);
        formik.setFieldValue('phase', phase);
        return;
      }
      const firstPosition = rankings.filter(
        (p) => p.value !== formik.values.position2 && p.currentPhase.id === formik.values.phase
      );
      const secondPosition = rankings.filter(
        (p) => p.value !== formik.values.position1 && p.currentPhase.id === formik.values.phase
      );
      setFirstPositionOptions(firstPosition);
      setSecondPositionOptions(secondPosition);
    }
  }, [formik.values.position1, formik.values.position2]);

  return (
    <DialogPresentation
      open={isOpen}
      title={t('create.create_a_game')}
      formik={formik}
      onClose={onClose}
      buttons={
        <>
          <Button onClick={onFinish} color="secondary">
            {t('cancel')}
          </Button>
          <Button type="submit" color="primary">
            {t('add.add')}
          </Button>
        </>
      }
    >
      {description}
      <Select options={phases} namespace="phase" label={t('phase')} formik={formik} />
      <Select options={firstPositionOptions} namespace="position1" label={t('Position 1')} formik={formik} />
      <Select options={secondPositionOptions} namespace="position2" label={t('Position 2')} formik={formik} />
    </DialogPresentation>
  );
};
export default AddGame;
