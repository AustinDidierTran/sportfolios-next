import React, { useRef } from 'react';

import CustomTextField from '../TextField';

export default function CustomFileInput(props) {
  const { onChange } = props;
  const inputEl = useRef(null);

  return <CustomTextField inputRef={inputEl} type="file" {...props} onChange={() => onChange(inputEl.current.files)} />;
}
