import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function CustomCheckBox(props) {
  const { checked, onChange, label, color, name, disabled } = props;

  const handleChange = (event) => {
    onChange(event.target.checked);
  };
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          color={color || 'primary'}
          name={name}
        />
      }
      label={label}
    />
  );
}
