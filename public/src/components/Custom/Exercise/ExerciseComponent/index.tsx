import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { useTranslation } from 'react-i18next';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '../../TextField';
import { EXERCISES_TYPE_ENUM } from '../../../../../common/enums';
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

  let valueType = 'default'
  if (formik) {
    valueType = formik.values['type'];
  }

  const typeOptions = [
    {
      display: t('default'),
      value: EXERCISES_TYPE_ENUM.DEFAULT,
    },
    {
      display: t('distance'),
      value: EXERCISES_TYPE_ENUM.DISTANCE,
    },
    {
      display: t('repetitions'),
      value: EXERCISES_TYPE_ENUM.REPETITIONS,
    },
    {
      display: t('time'),
      value: EXERCISES_TYPE_ENUM.TIME,
    },
  ];

  const handleChange = (event: any, ...args: any): void => {
    if (formik) {
      formik.handleChange(event, ...args);
    }

    if (onChange && event.target.name == namespace) {
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
        value={value}
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

          <FormControl className={'type'} style={{ width: '100%' }}>
            <InputLabel>{'type'}</InputLabel>
            <Select
              id={'type'}
              name="type"
              value={valueType}
              onChange={handleChange}
              inputProps={{ 'aria-label': 'type' }}
            >
              {typeOptions.map((option) => (
                <MenuItem value={option.value} key={option.value}>
                  {option.display}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      ) : null}

      <FormHelperText error={Boolean((formik && formik.errors[namespace]) || error)}>
        {(formik && formik.errors[namespace]) || error}
      </FormHelperText>
    </FormControl>
  );
};
export default CustomExercises;
