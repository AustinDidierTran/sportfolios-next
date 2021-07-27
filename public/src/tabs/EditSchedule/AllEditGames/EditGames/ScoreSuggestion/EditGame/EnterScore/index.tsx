import React, { useEffect, useState } from 'react';

import { FormDialog } from '../../../../../../../components/Custom';
import { useTranslation } from 'react-i18next';
import api from '../../../../../../../actions/api';
import { REQUEST_STATUS_ENUM, SEVERITY_ENUM } from '../../../../../../../../common/enums';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../../../../common/errors';
import { useContext } from 'react';
import { Store, ACTION_ENUM } from '../../../../../../../Store';
import { GameInfo } from '../../../../../../../../../typescript/types';

interface IProps {
  game: GameInfo;
  update: () => void;
  open: boolean;
  onClose: () => void;
}

const EnterScore: React.FunctionComponent<IProps> = (props) => {
  const { game, update, open: openProps, onClose } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [open, setOpen] = useState<boolean>(false);

  useEffect((): void => {
    setOpen(openProps);
  }, [openProps]);

  useEffect((): void => {
    formik.setFieldValue('score1', game.positions[0].score);
    formik.setFieldValue('score2', game.positions[1].score);
  }, [game]);

  const validate = (values: { score1: number; score2: number }): { score1?: string; score2?: string } => {
    const { score1, score2 } = values;
    const errors: { score1?: string; score2?: string } = {};
    if (isNaN(score1)) {
      errors.score1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (isNaN(score2)) {
      errors.score2 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      score1: null,
      score2: null,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { score1, score2 } = values;
      const res = await api('/api/entity/gameScore', {
        method: 'POST',
        body: JSON.stringify({
          eventId: game.eventId,
          gameId: game.id,
          score: {
            [game.positions[0].rosterId]: score1,
            [game.positions[1].rosterId]: score2,
          },
          isManualAdd: true,
        }),
      });
      resetForm();
      if (res.status === REQUEST_STATUS_ENUM.SUCCESS) {
        update();
        onClose();
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      }
    },
  });

  const formButtons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('done'),
      color: 'primary',
    },
  ];

  const fields = game.positions.reduce(
    (prev, curr, index) => [
      ...prev,
      {
        type: 'number',
        namespace: `score${index + 1}`,
        label: `${t('score.score')} :  ${curr.name}`,
        autoFocus: index === 0,
      },
    ],
    []
  );

  return (
    <FormDialog
      open={open}
      onClose={onClose}
      title={t('enter_score')}
      fields={fields}
      formik={formik}
      buttons={formButtons}
    />
  );
};
export default EnterScore;
