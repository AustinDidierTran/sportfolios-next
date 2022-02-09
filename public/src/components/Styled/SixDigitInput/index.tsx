import React, { ChangeEventHandler, useCallback, useEffect, useRef } from 'react';

import styled from 'styled-components';
import { ERROR_ENUM } from '../../../../common/errors';
import { useDeleteListener } from '../../../hooks/forms';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
`;

const DivContainer = styled.div`
  background-color: #ebebeb;
  height: 2.75rem;
  width: 2.75rem;
  border-radius: 0.6875rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  border: none;
  background: none;
  text-align: center;

  :focus {
    outline: none;
  }
`;

/**
 * We assume that the main focus when using
 * this element is this element. It should be adapted otherwise
 */

interface Props {
  onChange: (value: string) => void;
  value: string;
}

const SixDigitInput: React.FunctionComponent<Props> = (props) => {
  const { onChange, value } = props;

  const itemsRef = useRef([]);

  useEffect(() => {
    itemsRef.current[0].focus();
  }, []);

  const onDelete = useCallback(() => {
    onChange(value.slice(0, value.length - 1));
  }, [value]);

  useDeleteListener(onDelete);

  useEffect(() => {
    const newIndex = value.length;
    if (newIndex < 6) {
      itemsRef.current[newIndex].focus();
    }
  }, [value]);

  const onInputChange = useCallback(
    (v) => {
      if (!isNaN(+v)) {
        const newValue = `${value}${v}`;
        onChange(newValue);
      }
    },
    [value]
  );

  const onFocus = useCallback(() => {
    const index = value.length;
    if (index < 6) {
      itemsRef.current[index].focus();
    }
  }, [value]);

  const array = Array(6)
    .fill(0)
    .map((_, index) => index);
  return (
    <Container>
      {array.map((_, index) => (
        <DivContainer key={index} onFocus={onFocus}>
          <Input
            value={value[index] || ''}
            ref={(el) => (itemsRef.current[index] = el)}
            onChange={(e) => onInputChange(e.target.value)}
          />
        </DivContainer>
      ))}
    </Container>
  );
};

export default SixDigitInput;
