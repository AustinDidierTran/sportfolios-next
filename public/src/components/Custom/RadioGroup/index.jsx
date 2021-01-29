import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemText from '@material-ui/core/ListItemText';

import styles from './RadioGroup.module.css';

export default function CustomRadioGroup(props) {
  const { namespace, options, title, value, onChange, centered } = props;

  let className = styles.radio;
  if (centered) {
    className = styles.centered;
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <RadioGroup aria-label={namespace} name={namespace} value={value} onChange={onChange} className={className}>
        {options.map((option, index) => (
          <FormControlLabel
            value={option.value}
            label={<ListItemText className={styles.div} primary={option.display} secondary={option.secondary} />}
            control={<Radio color="primary" />}
            key={index}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
