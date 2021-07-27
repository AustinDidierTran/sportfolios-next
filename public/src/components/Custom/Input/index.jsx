import React from 'react';

import CustomTextField from '../TextField';

import FileInput from './FileInput';

import DateInput from './DateInput';

import DateTimeInput from './TimeInput';

export default function CustomInput(props) {
  const { isVisible = true, type, ...inputProps } = props;

  if (!isVisible) {
    return null;
  }
  switch (type) {
    case 'date':
      return <DateInput {...props} />;
    case 'time':
      return <DateTimeInput type="time" {...inputProps} />;
    case 'file':
      return <FileInput type="file" {...inputProps} />;
    case 'number':
      return <CustomTextField type="number" {...inputProps} />;
    case 'text':
      return <CustomTextField type="text" {...inputProps} />;
    default:
      return <CustomTextField {...props} />;
  }
}
