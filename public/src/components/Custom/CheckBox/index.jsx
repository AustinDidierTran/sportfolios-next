import React, { useMemo } from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '../IconButton';
import styles from './CheckBox.module.css';
import { COLORS } from '../../../utils/colors';

export default function CustomCheckBox(props) {
  const {
    checked: checkedProps,
    formik,
    onChange,
    label,
    color,
    name,
    namespace,
    disabled,
    tooltip,
    ...otherProps
  } = props;
  const handleChange = (event) => {
    if (formik) {
      formik.setFieldValue(namespace, event.target.checked);
    }

    if (onChange) {
      onChange(event.target.checked);
    }
  };

  const checked = useMemo(() => {
    if (formik) {
      return formik.values[namespace];
    }

    return checkedProps;
  }, [formik, checkedProps]);

  return (
    <div className={styles.div}>
      <FormControlLabel
        style={{ margin: '0px' }}
        control={
          <Checkbox
            disabled={disabled}
            onChange={handleChange}
            {...otherProps}
            checked={checked}
            color={color || 'primary'}
            name={name}
          />
        }
        label={label}
      />
      {tooltip ? <IconButton icon="Info" style={{ color: COLORS.grey }} tooltip={tooltip} /> : null}
    </div>
  );
}
