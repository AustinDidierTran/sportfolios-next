import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';
import FormHelperText from '@material-ui/core/FormHelperText';
import AddressSearchInput from '../AddressSearchInput';
import TextField from '../TextField';
import { SELECT_ENUM, LANGUAGE_ENUM } from '../../../../common/enums';
import { FormikValues } from 'formik';

interface IProps {
  className?: string;
  error?: string;
  formik: FormikValues;
  label: string;
  namespace: string;
  onChange: (event: any) => void;
  options: ILocationOption[];
  showView: boolean;
  addressChanged: (address: string) => void;
  onAddressChanged: (address: string) => void;
  language: typeof LANGUAGE_ENUM;
  errorFormat: string;
  showCreate: boolean;
  value?: string;
}

interface ILocationOption {
  value: string;
  display: string;
}

const CustomLocations: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const {
    className,
    error,
    formik,
    label,
    namespace,
    onChange,
    options,
    showView,
    addressChanged,
    onAddressChanged,
    language,
    errorFormat,
    showCreate,
    value: valueProp,
  } = props;

  //Value cannot be undefined so it is set to an empty string by default
  let value = '';
  if (formik) {
    value = formik.values[namespace];
  } else if (valueProp) {
    value = valueProp;
  }

  const handleChange = (event: any, ...args: any) => {
    if (formik) {
      formik.handleChange(event, ...args);
    }

    if (onChange) {
      onChange(event.target.value);
    }
  };

  if (showView === true) {
    return (
      <div>
        <TextField namespace="addressFormatted" formik={formik} disabled />
        <TextField placeholder="location" namespace="location" formik={formik} disabled />
      </div>
    );
  }

  return (
    <FormControl className={className} style={{ width: '100%' }}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        id={namespace}
        name={namespace}
        {...props}
        error={Boolean((formik && formik.errors[namespace]) || error)}
        value={!options?.length && value === SELECT_ENUM.ALL ? '' : value}
        onChange={handleChange}
        defaultValue=""
        inputProps={{ 'aria-label': namespace }}
      >
        {label && (
          <MenuItem disabled value="">
            {label}
          </MenuItem>
        )}

        {options && options.length ? (
          options.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.display}
            </MenuItem>
          ))
        ) : (
          <div />
        )}
      </Select>

      {showCreate ? (
        <div>
          <br />
          <AddressSearchInput
            namespace="addressFormatted"
            formik={formik}
            addressChanged={addressChanged}
            country="ca"
            language={language}
            errorFormat={errorFormat}
            placeholder={t('type_address')}
            onChange={onAddressChanged}
            required={false}
          />
          <TextField fullWidth label={t('location_description')} namespace="newLocation" formik={formik} />
        </div>
      ) : (
        <div />
      )}

      <FormHelperText error={Boolean((formik && formik.errors[namespace]) || error)}>
        {(formik && formik.errors[namespace]) || error}
      </FormHelperText>
    </FormControl>
  );
};
export default CustomLocations;
