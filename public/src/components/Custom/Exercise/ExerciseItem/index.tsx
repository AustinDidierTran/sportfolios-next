import React, { useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './ExerciseItem.module.css';
import CustomCollapse from '../../Collapse';
import CustomIconButton from '../../IconButton';
import { Evaluation as IEvaluation, Exercise } from '../../../../../../typescript/types';
import { getCoachSessionEvaluation, getPlayerSessionEvaluation } from '../../../../actions/service/entity/get';
import Evaluation from '../../Evaluation';
import Typography from '@material-ui/core/Typography';
import EvaluationItem from '../../Evaluation/EvaluationItem';
import CustomButton from '../../Button';
import { AlertDialog } from '../..';
import { deleteSessionExercise } from '../../../../actions/service/entity/delete';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';

interface IProps {
  exercise?: Exercise;
  index: number;
  practiceId: string;
  isCoach: boolean;
  deleteExercise: (exerciseId: string)=>void;
}

const ExerciseItem: React.FunctionComponent<IProps> = (props) => {
  const { exercise, practiceId, index, isCoach, deleteExercise } = props;
  const { t } = useTranslation();
  const {
    dispatch,
  } = useContext(Store);

  const [expanded, setExpanded] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<IEvaluation[]>();
  const [evaluations, setEvaluations] = useState<IEvaluation[]>();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const handleExpand = (): void => {
    setExpanded(!expanded);
  };

  const icon = useMemo(
    (): 'KeyboardArrowUp' | 'KeyboardArrowDown' => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'),
    [expanded]
  );

  useMemo(
    (): Promise<void> =>
      isCoach
        ? getCoachSessionEvaluation(exercise.id, practiceId).then(setEvaluations)
        : getPlayerSessionEvaluation(exercise.id, practiceId).then(setEvaluation),
    [isCoach]
  );

  const onClickDelete = async (): Promise<void> => {
    setOpenDelete(true);
  };

  const onDelete =  (): void => {
    deleteSessionExercise(practiceId, exercise.id).then((status) => {
      if (status > REQUEST_STATUS_ENUM.SUCCESS) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        deleteExercise(exercise.id);
      }
    });
  }

  return (
    <>
      <ListItem className={index % 2 === 0 ? styles.greycard : styles.card} onClick={handleExpand} key={exercise.id}>
        <ListItemText className={styles.primary} primary={exercise.name} secondary={t(exercise.type)} />
        <CustomIconButton style={{ color: 'grey' }} onClick={handleExpand} aria-expanded={expanded} icon={icon} />
      </ListItem>

      <CustomCollapse in={expanded} timeout="auto" unmountOnExit>
        <div className={styles.whiteSmoke}>
          <Typography color="textSecondary">
            {exercise.description ? t('description.description') + ' : ' + exercise.description : null}
          </Typography>
          {isCoach ? (
            <Evaluation evaluations={evaluations} key={exercise.id} />
          ) : evaluation?.length > 1 ? (
            <Evaluation evaluations={evaluation} key={exercise.id} />
          ) : (
            <EvaluationItem evaluation={evaluation ? evaluation[0] : null} key={exercise.id} />
          )}
        </div>
        {isCoach ? (
          <CustomButton
            size="small"
            variant="contained"
            color="secondary"
            endIcon="Delete"
            onClick={onClickDelete}
            className={styles.button}
          >
            {t('delete.delete')}
          </CustomButton>
        ) : null}
      </CustomCollapse>
      <AlertDialog
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        title={t('exercise_delete')}
        onSubmit={onDelete}
      />
    </>
  );
};
export default ExerciseItem;
