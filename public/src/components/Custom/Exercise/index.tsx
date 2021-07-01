import React, { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Exercise.module.css';
import Typography from '@material-ui/core/Typography';
import { Exercise as IExercise } from '../../../../../typescript/types';
import CustomButton from '../Button';
import AddExercise from './AddExercise';
import ExerciseItem from './ExerciseItem';

interface IProps {
  exercises?: IExercise[];
  teamId: string;
  practiceId: string;
  getExercises: () => void;
}

const Exercise: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { exercises, teamId, practiceId, getExercises } = props;
  const [exercisesList, setExercisesList] = useState<IExercise[]>([]);
  const [openExercise, setOpenExercise] = useState<boolean>(false);

  useMemo((): void => setExercisesList(exercises), [exercises]);

  const addExercise = (): void => {
    setOpenExercise(true);
  };

  const closePractice = (): void => {
    setOpenExercise(false);
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <Typography className={styles.title} variant="h4">
        {t('exercises')}
        <div>
          <CustomButton style={{ marginBottom: '6px' }} onClick={addExercise} endIcon="Add" color="primary">
            {t('add.add_exercise')}
          </CustomButton>
        </div>
      </Typography>
      {exercisesList?.map((exercise: IExercise, index: number) => (
        <ExerciseItem exercise={exercise} teamId={teamId} index={index} key={exercise.id} />
      ))}
      <AddExercise
        exercises={exercisesList}
        isOpen={openExercise}
        practiceId={practiceId}
        onAdd={getExercises}
        onClose={closePractice}
      />
    </div>
  );
};

export default Exercise;
