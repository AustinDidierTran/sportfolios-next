import React, { useMemo, useState, useContext } from 'react';

import CustomButton from '../../Button';
import CustomPaper from '../../Paper';
import CustomTextField from '../../TextField';
import { useFormInput } from '../../../../hooks/forms';
import { goTo, ROUTES } from '../../../../actions/goTo';

import styles from './DeleteEntity.module.css';
import { useTranslation } from 'react-i18next';
import { deleteEntity } from '../../../../actions/service/entity/delete';
import { ACTION_ENUM, Store } from '../../../../Store';
import { ERROR_ENUM } from '../../../../../common/errors';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../../common/enums';

interface IProps {
  id: string;
  name: string;
  type: string;
}

const DeleteEntity: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { id, name, type } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { dispatch } = useContext(Store);

  const validator = useFormInput('');

  const isValid = useMemo<boolean>(() => validator.value === name, [validator.value, name]);

  const handleClick = async (): Promise<void> => {
    setIsSubmitting(true);
    if (!isValid) {
      validator.setError(`To delete, enter ${name}`);
      setIsSubmitting(false);
    } else {
      const status = await deleteEntity(id, type);
      if (status === STATUS_ENUM.ERROR) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        goTo(ROUTES.home);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <CustomPaper title={t('delete.delete')} childrenProps={{ className: styles.paper }}>
      <CustomTextField
        className={styles.textfield}
        helperText={t('delete.delete_confirmation_text', { name })}
        {...validator.inputProps}
      />

      <CustomButton
        className={styles.button}
        color="secondary"
        onClick={handleClick}
        disabled={isSubmitting || !isValid}
      >
        {t('delete.delete')}
      </CustomButton>
    </CustomPaper>
  );
};
export default DeleteEntity;
