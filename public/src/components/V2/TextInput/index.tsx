import React, { ChangeEventHandler } from 'react';

interface TextInputProps {
  onChange: ChangeEventHandler;
  value: string;
}

const TextInput: React.FunctionComponent<TextInputProps> = ({ onChange, value }) => {
  return <input onChange={onChange} value={value} />;
};

export default TextInput;
