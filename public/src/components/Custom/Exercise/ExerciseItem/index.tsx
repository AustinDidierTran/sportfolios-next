import React, { useState, useMemo, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import styles from './ExerciseItem.module.css';
import CustomCollapse from '../../Collapse';
import CustomIconButton from '../../IconButton';
import { Evaluation as IEvaluation, Exercise } from '../../../../../../typescript/types';
import { getPlayerSessionEvaluation, getPlayerTeamRole } from '../../../../actions/service/entity/get';
import Evaluation from '../../Evaluation';
import Typography from '@material-ui/core/Typography';

interface IProps {
  exercise?: Exercise;
  teamId: string;
  index: number;
}

const ExerciseItem: React.FunctionComponent<IProps> = (props) => {
  const { exercise, teamId, index } = props;

  const [expanded, setExpanded] = useState<boolean>(false);
  const [evaluation, setEvaluation] = useState<IEvaluation>();
  const [role, setRole] = useState<string>('');

  const handleExpand = (): void => {
    setExpanded(!expanded);
  };

  const icon = useMemo(
    (): 'KeyboardArrowUp' | 'KeyboardArrowDown' => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'),
    [expanded]
  );

  useEffect((): void => {
    if (exercise) {
      getPlayerSessionEvaluation(exercise.id).then(setEvaluation);
      getPlayerTeamRole(teamId).then(setRole);
    }
  }, [exercise]);

  return (
    <>
      <ListItem className={index % 2 === 0 ? styles.greycard : styles.card} onClick={handleExpand} key={exercise.id}>
        <ListItemText className={styles.primary} primary={exercise.name} />
        <CustomIconButton style={{ color: 'grey' }} onClick={handleExpand} aria-expanded={expanded} icon={icon} />
      </ListItem>

      <CustomCollapse in={expanded} timeout="auto" unmountOnExit>
        <div className={styles.whiteSmoke}>
          <Typography color="textSecondary">
            {exercise.description ? 'Description : ' + exercise.description : null}
          </Typography>
          <Evaluation evaluation={evaluation} role={role} />
        </div>
      </CustomCollapse>
    </>
  );
};
export default ExerciseItem;
