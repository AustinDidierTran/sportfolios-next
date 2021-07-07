import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './ExerciseItem.module.css';
import CustomCollapse from '../../Collapse';
import CustomIconButton from '../../IconButton';
import { Evaluation as IEvaluation, Exercise } from '../../../../../../typescript/types';
import {
  getCoachSessionEvaluation,
  getPlayerSessionEvaluation,
  getIsEvaluationCoach,
} from '../../../../actions/service/entity/get';
import Evaluation from '../../Evaluation';
import Typography from '@material-ui/core/Typography';
import EvaluationItem from '../../Evaluation/EvaluationItem';

interface IProps {
  exercise?: Exercise;
  index: number;
  practiceId: string;
}

const ExerciseItem: React.FunctionComponent<IProps> = (props) => {
  const { exercise, practiceId, index } = props;
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<IEvaluation[]>();
  const [evaluations, setEvaluations] = useState<IEvaluation[]>();
  const [isCoach, setIsCoach] = useState<boolean>(false);

  const handleExpand = (): void => {
    setExpanded(!expanded);
  };

  const icon = useMemo(
    (): 'KeyboardArrowUp' | 'KeyboardArrowDown' => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'),
    [expanded]
  );

  useEffect((): void => {
    if (exercise) {
      getIsEvaluationCoach(exercise.id, practiceId).then(setIsCoach);
    }
  }, [exercise]);

  useMemo(
    (): Promise<void> =>
      isCoach
        ? getCoachSessionEvaluation(exercise.id, practiceId).then(setEvaluations)
        : getPlayerSessionEvaluation(exercise.id, practiceId).then(setEvaluation),
    [isCoach]
  );

  return (
    <>
      <ListItem className={index % 2 === 0 ? styles.greycard : styles.card} onClick={handleExpand} key={exercise.id}>
        <ListItemText className={styles.primary} primary={exercise.name} />
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
            <Evaluation evaluations={evaluation} key={exercise.id}/>
          ) : (
            <EvaluationItem evaluation={evaluation ? evaluation[0] : null} key={exercise.id}/>
          )}
        </div>
      </CustomCollapse>
    </>
  );
};
export default ExerciseItem;
