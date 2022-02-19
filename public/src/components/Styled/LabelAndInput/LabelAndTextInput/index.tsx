import React from 'react';
import styled from 'styled-components';
import LabelAndInput from '..';

interface Props {
  label: string;
  onChange: React.ChangeEventHandler;
  value: any;
  placeholder: string;
}

export const Input = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.shadesOfGrey.light};
  padding: 0.5rem 0;

  :focus {
    outline: none;
  }
`;

const LabelAndTextInput: React.FunctionComponent<Props> = (props) => {
  return (
    <LabelAndInput label={props.label}>
      <Input placeholder={props.placeholder} value={props.value} onChange={props.onChange} />
    </LabelAndInput>
  );
};

export default LabelAndTextInput;
