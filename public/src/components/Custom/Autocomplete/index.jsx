import React, { useState, useEffect } from 'react';

import isEqual from 'lodash/isEqual';

import Autocomplete from '@material-ui/lab/Autocomplete';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../TextField';
import CustomIcon from '../Icon';
import api from '../../../actions/api';
import { REQUEST_STATUS_ENUM } from '../../../../common/enums';

export default function CustomAutocomplete(props) {
  const { t } = useTranslation();
  const { formik, inputProps = {}, namespace, onChange, optionsRoute, type, icon, iconColor, ...otherProps } = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (optionsRoute) {
      getOptions();
    }
  }, [optionsRoute]);

  const getOptions = async () => {
    const { status, data } = await api(optionsRoute, { method: 'GET' });
    if (status === REQUEST_STATUS_ENUM.SUCCESS) {
      setOptions(data.options);
    } else {
      setOptions([]);
    }
  };

  const handleChange = (...args) => {
    const [, { value } = {}] = args;

    if (!formik && !onChange) {
      /* eslint-disable-next-line */
      console.error('Handle Change on Custom Autocomplete does nothing');
    }

    if (formik) {
      formik.setFieldValue(namespace, value);
    }

    if (onChange) {
      onChange(value);
    }
  };

  return (
    <Autocomplete
      autoHighlight
      getOptionLabel={(option) => option.display}
      options={options}
      getOptionSelected={isEqual}
      clearOnEscape
      renderInput={(params) => {
        return (
          <CustomTextField
            {...params}
            {...inputProps}
            onChange={onChange}
            namespace={namespace}
            formik={formik}
            type={type}
            label={t(namespace)}
            fullWidth
            placeholder={t('search_sportfolios')}
            inputProps={{
              ...params.inputProps,
              classes: inputProps.classes,
              autoComplete: 'new-password',
            }}
            InputProps={{
              ...params.InputProps,
              ...inputProps.InputProps,
              disableUnderline: true,

              startAdornment: (
                <>
                  {icon ? (
                    <InputAdornment position="start">
                      <CustomIcon icon={icon} color={iconColor} />
                    </InputAdornment>
                  ) : null}
                </>
              ),
            }}
          />
        );
      }}
      {...otherProps}
      onChange={handleChange}
    />
  );
}
