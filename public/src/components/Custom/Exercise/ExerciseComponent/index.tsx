import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '../../TextField';
import { SELECT_ENUM } from '../../../../../common/enums';
import { FormikValues } from 'formik';

interface IProps {
  className?: string;
  error?: string;
  formik: FormikValues;
  label: string;
  namespace: string;
  onChange: (event: any) => void;
  options: IExerciseOption[];
  showView: boolean;
  showCreate: boolean;
  value?: string;
}

interface IExerciseOption {
  value: string;
  display: string;
}

const CustomExercises: React.FunctionComponent<IProps> = (props) => {
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

  const handleChange = (event: any, ...args: any): void => {
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
        <TextField namespace="name" formik={formik} disabled />
        <TextField placeholder="description" namespace="description" formik={formik} disabled />
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

        {options && options.length
          ? options.map((option) => (
              <MenuItem value={option.value} key={option.value}>
                {option.display}
              </MenuItem>
            ))
          : null}
      </Select>

      {showCreate ? (
        <div>
          <br></br>
          <TextField fullWidth label={t('name')} namespace="name" formik={formik} />
          <TextField fullWidth label={'Description'} namespace="description" formik={formik} />
        </div>
      ) : null}

      <FormHelperText error={Boolean((formik && formik.errors[namespace]) || error)}>
        {(formik && formik.errors[namespace]) || error}
      </FormHelperText>
    </FormControl>
  );
};
export default CustomExercises;
