import React, { useMemo, useState } from 'react';

import CustomButton from '../../Button';
import CustomPaper from '../../Paper';
import CustomTextField from '../../TextField';
import { useFormInput } from '../../../../hooks/forms';
import { goTo, ROUTES } from '../../../../actions/goTo';

import styles from './DeleteEntity.module.css';
import { useTranslation } from 'react-i18next';
import { deleteEntity } from '../../../../actions/service/entity/delete';

interface IProps {
  id: string;
  name: string;
  type: string;
}

const DeleteEntity: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { id, name, type } = props;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validator = useFormInput('');

  const isValid = useMemo<boolean>(() => validator.value === name, [validator.value, name]);

  const handleClick = async (): Promise<void> => {
    setIsSubmitting(true);
    if (!isValid) {
      validator.setError(`To delete, enter ${name}`);
      setIsSubmitting(false);
    } else {
      await deleteEntity(id, type);
      setIsSubmitting(false);
      goTo(ROUTES.home);
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
