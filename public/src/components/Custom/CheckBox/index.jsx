import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '../IconButton';
import styles from './CheckBox.module.css';

export default function CustomCheckBox(props) {
  const { checked, onChange, label, color, name, disabled, tooltip, ...otherProps } = props;
  const handleChange = (event) => {
    onChange(event.target.checked);
  };
  return (
    <div className={styles.div}>
      <FormControlLabel
        style={{ margin: '0px' }}
        control={
          <Checkbox
            checked={checked}
            disabled={disabled}
            onChange={handleChange}
            {...otherProps}
            color={color || 'primary'}
            name={name}
          />
        }
        label={label}
      />
      {tooltip ? <IconButton icon="Info" style={{ color: 'grey' }} tooltip={tooltip} /> : <></>}
    </div>
  );
}
