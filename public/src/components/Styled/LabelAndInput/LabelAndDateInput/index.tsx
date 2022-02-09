import React from 'react';
import InputMask from 'react-input-mask';
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

const LabelAndDateInput: React.FunctionComponent<Props> = (props) => {
  return (
    <LabelAndInput label={props.label}>
      <InputMask maskPlaceholder="yyyy-mm-dd" mask="9999-99-99" value={props.value} onChange={props.onChange}>
        <Input placeholder={props.placeholder} />
      </InputMask>
    </LabelAndInput>
  );
};

export default LabelAndDateInput;
