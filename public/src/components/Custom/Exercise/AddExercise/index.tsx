import React, { useState, useEffect, useContext, useMemo } from 'react';
import { FormDialog } from '../..';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import { Store, ACTION_ENUM } from '../../../../Store';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import * as yup from 'yup';
import { Exercise } from '../../../../../../typescript/types';
import { getTeamExercises as getTeamExercisesApi } from '../../../../actions/service/entity/get';
import { addExercise } from '../../../../actions/service/entity/post';

interface IProps {
  exercises: Exercise[];
  isOpen: boolean;
  practiceId: string;
  onClose: () => void;
  onAdd: () => void;
}

interface IExerciseOption {
  value: string;
  display: string;
}

const AddPractice: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { exercises, isOpen, practiceId, onClose, onAdd } = props;
  const {
    dispatch,
    state: { id: teamId },
  } = useContext(Store);

  const [exerciseOptions, setExerciseOptions] = useState<IExerciseOption[]>([]);
  const [exerciseHidden, setExerciseHidden] = useState<boolean>(true);

  useEffect((): void => {
    if (isOpen) {
      getTeamExercises();
      setExerciseHidden(true);
    }
  }, [isOpen]);

  const open = useMemo((): boolean => isOpen, [isOpen]);

  const handleClose = (): void => {
    formik.resetForm();
    onClose();
    setExerciseHidden(true);
  };

  const getTeamExercises = async (): Promise<void> => {
    let data = await getTeamExercisesApi(teamId);
    if (!data) {
      data = [];
    }

    if (exercises.length > 0) {
      data = data.filter((e: Exercise) => !exercises.some((exe) => exe.id === e.id));
    }

    data.push({ id: t('create_new_exercise'), name: t('create_new_exercise'), description: '', type: '' });

    const exerciseOption: IExerciseOption[] = data.map((e: Exercise) => ({
      value: e.id,
      display: `${e.name}`,
    }));

    setExerciseOptions(exerciseOption);
  };

  const handleChange = (event: any): void => {
    if (event == t('create_new_exercise')) {
      setExerciseHidden(false);
    } else {
      setExerciseHidden(true);
      formik.setFieldValue('name', '');
      formik.setFieldValue('description', '');
    }
  };

  const validationSchema = yup.object().shape({
    name: yup.string().when('exercise', {
      is: (exercise: string) => exercise == t('create_new_exercise'),
      then: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    }),
    exercise: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      exercise: '',
      name: '',
      description: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { exercise, name, description } = values;
      let exerciseId = null;
      if (exercise != t('create_new_exercise')) {
        exerciseId = exercise;
      }

      const status = await addExercise(exerciseId, name, description, practiceId, teamId);

      if (status === REQUEST_STATUS_ENUM.ERROR || status === REQUEST_STATUS_ENUM.UNAUTHORIZED) {
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
        message: t('exercise_added'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
      onAdd();
      onClose();
      resetForm();
    },
  });

  const buttons = [
    {
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add.add'),
      color: 'primary',
    },
  ];

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.EXERCISE,
      label: t('exercise'),
      namespace: 'exercise',
      onChange: handleChange,
      options: exerciseOptions,
      showCreate: !exerciseHidden,
    },
  ];

  return (
    <FormDialog
      open={open}
      title={t('add.add_exercise')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
};

export default AddPractice;
