import React from 'react';
import styled from 'styled-components';
import LabelAndInput from '..';

interface SelectOption {
  display: string;
  value: any;
}

interface Props {
  label: string;
  options: SelectOption[];
  onChange: React.ChangeEventHandler;
  value: any;
  placeholder: string;
}

export const Option = styled.option``;

export const Select = styled.select`
  appearance: none;
  background-color: transparent;
  width: 100%;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.shadesOfGrey.light};

  padding: 0.5rem 0;

  :focus {
    outline: none;
  }

  ::-ms-expand {
    display: none;
  }
`;

const LabelAndSelectInput: React.FunctionComponent<Props> = (props) => {
  return (
    <LabelAndInput label={props.label}>
      <Select placeholder={props.placeholder} value={props.value} onChange={props.onChange}>
        {props.options.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.display}
          </Option>
        ))}
      </Select>
    </LabelAndInput>
  );
};

export default LabelAndSelectInput;
