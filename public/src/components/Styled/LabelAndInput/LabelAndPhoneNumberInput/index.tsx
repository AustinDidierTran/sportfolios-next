import React from 'react';
import styled from 'styled-components';
import LabelAndInput from '..';
import InputMask from 'react-input-mask';

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

const LabelAndPhoneNumberInput: React.FunctionComponent<Props> = (props) => {
  return (
    <LabelAndInput label={props.label}>
      <InputMask mask="+1 (999) 999-9999" value={props.value} onChange={props.onChange}>
        <Input placeholder={props.placeholder} />
      </InputMask>
    </LabelAndInput>
  );
};

export default LabelAndPhoneNumberInput;
