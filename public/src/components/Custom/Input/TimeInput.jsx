import React, { useState } from 'react';
import moment from 'moment';
import CustomTextField from '../TextField';
import { useTranslation } from 'react-i18next';

export default function CustomDateInput(props) {
  const { error, value } = { ...props };
  const { t } = useTranslation();

  const [inputError, setInputError] = useState();

  const validateInput = () => {
    var date = moment(value);

    if (!date.isValid()) {
      setInputError(t('invalid.invalid_date_it_should_follow'));
    } else if (date > moment()) {
      setInputError(t('date_in_future'));
    } else {
      setInputError();
    }
  };

  return (
    <>
      <CustomTextField
        error={error || inputError}
        type="time"
        inputProps={{
          onBlur: () => {
            validateInput();
          },
        }}
        {...props}
      />
    </>
  );
}
