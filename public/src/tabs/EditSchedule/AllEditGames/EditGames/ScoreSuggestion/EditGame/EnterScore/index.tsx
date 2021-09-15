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

interface IValues {
  score1: number;
  score2: number;
  spirit1: number;
  spirit2: number;
}

interface IErrors {
  score1?: string;
  score2?: string;
  spirit1?: string;
  spirit2?: string;
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
    formik.setFieldValue('spirit1', game.positions[0].spirit);
    formik.setFieldValue('spirit2', game.positions[1].spirit);
  }, [game]);

  const validate = (values: IValues): IErrors => {
    const { score1, score2, spirit1, spirit2 } = values;
    const errors: IErrors = {};
    if (isNaN(score1)) {
      errors.score1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (isNaN(score2)) {
      errors.score2 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (isNaN(spirit1)) {
      errors.spirit1 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (isNaN(spirit2)) {
      errors.spirit2 = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      score1: null,
      score2: null,
      spirit1: null,
      spirit2: null,
    },
    validate,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values, { resetForm }) => {
      const { score1, score2, spirit1, spirit2 } = values;
      const res = await api('/api/game/score', {
        method: 'PUT',
        body: JSON.stringify({
          eventId: game.eventId,
          gameId: game.id,
          rosters: [
            {
              rosterId: game.positions[0].rosterId,
              score: score1,
              spirit: spirit1,
            },
            {
              rosterId: game.positions[1].rosterId,
              score: score2,
              spirit: spirit2,
            },
          ],
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
      {
        type: 'number',
        namespace: `spirit${index + 1}`,
        label: `${t('score.spirit')} :  ${curr.name}`,
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
