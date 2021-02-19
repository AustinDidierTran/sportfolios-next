import React, { useMemo, useState } from 'react';

import CustomButton from '../../Button';
import CustomPaper from '../../Paper';
import CustomTextField from '../../TextField';
import { useFormInput } from '../../../../hooks/forms';
import { deleteEntity } from '../../../../actions/api';
import { goTo, ROUTES } from '../../../../actions/goTo';

import styles from './DeleteEntity.module.css';
import { useTranslation } from 'react-i18next';

export default function DeleteEntity(props) {
  const { t } = useTranslation();
  const { id, name, ...otherProps } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validator = useFormInput('');

  const isValid = useMemo(() => validator.value === name, [validator.value, name]);

  const handleClick = async () => {
    setIsSubmitting(true);
    if (!isValid) {
      validator.setError(`To delete, enter ${name}`);
      setIsSubmitting(false);
    } else {
      await deleteEntity(id);
      setIsSubmitting(false);
      goTo(ROUTES.home);
    }
  };

  return (
    <CustomPaper title={t('delete.delete')} childrenProps={{ className: styles.paper }} {...otherProps}>
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
}
