import React, { useMemo, useState, useEffect, useContext } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './Exercise.module.css';
import Typography from '@material-ui/core/Typography';
import { Exercise as IExercise } from '../../../../../typescript/types';
import CustomButton from '../Button';
import AddExercise from './AddExercise';
import ExerciseItem from './ExerciseItem';
import { getIsTeamCoach } from '../../../actions/service/entity/get';
import { Store } from '../../../../../public/src/Store';

interface IProps {
  exercises?: IExercise[];
  practiceId: string;
  getExercises: () => void;
}

const Exercise: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { exercises, practiceId, getExercises } = props;
  const [exercisesList, setExercisesList] = useState<IExercise[]>([]);
  const [openExercise, setOpenExercise] = useState<boolean>(false);
  const [isCoach, setIsCoach] = useState<boolean>(false);

  const {
    state: { id: teamId },
  } = useContext(Store);

  useMemo((): void => setExercisesList(exercises), [exercises]);

  useEffect((): void => {
    if (exercises.length > 0) {
      getIsTeamCoach(teamId).then(setIsCoach);
    }
  }, [exercises]);


  const addExercise = (): void => {
    setOpenExercise(true);
  };

  const closePractice = (): void => {
    setOpenExercise(false);
  };

  const deleteExercise = (exerciseId: string): void => {
    setExercisesList(exercisesList.filter((e) => e.id != exerciseId));
  };

  return (
    <div style={{ marginTop: '8px' }}>
      <Typography className={styles.title} variant="h4">
        {t('exercises')}
        <div>
          {isCoach ? (
            <CustomButton style={{ marginBottom: '6px' }} onClick={addExercise} endIcon="Add" color="primary">
              {t('add.add_exercise')}
            </CustomButton>
          ) : null}
        </div>
      </Typography>
      {exercisesList?.map((exercise: IExercise, index: number) => (
        <ExerciseItem isCoach={isCoach} exercise={exercise} practiceId={practiceId} deleteExercise={deleteExercise} index={index} key={exercise.id} />
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
