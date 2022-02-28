import { Search } from '@material-ui/icons';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { ChangeEventHandler, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  background-color: ${(props) => props.theme.shadesOfGrey.light};
  border-radius: 0.75rem;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  text-align: center;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: none;
  text-align: center;
  width: 80%;

  :focus {
    outline: none;
  }

  ::placeholder {
    color: ${(props) => props.theme.shadesOfGrey.primary};
    opacity: 1;
  }
`;

const RightSection = styled.div`
  height: 1.125rem;
  width: 1.5rem;
`;

interface Classes {
  container?: string;
  icon?: string;
  input?: string;
}

interface TextInputProps {
  autofocus?: boolean;
  classes?: Classes;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  type?: string;
  value: string;
}

const TextInput: React.FunctionComponent<TextInputProps> = ({
  autofocus = false,
  classes = {},
  onChange,
  placeholder,
  type = 'text',
  value,
}) => {
  const inputElement = useRef(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (autofocus && inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  const Icon = useMemo(() => (showPassword ? Visibility : VisibilityOff), [showPassword]);

  const actualType = useMemo(() => {
    if (type === 'password') {
      if (showPassword) {
        return 'text';
      }
      return 'password';
    }

    return type;
  }, [showPassword, type]);

  return (
    <Container className={classes.container}>
      <Input
        ref={inputElement}
        className={classes.input}
        onChange={onChange}
        placeholder={placeholder}
        type={actualType}
        value={value}
      />
      <RightSection>
        {type === 'password' ? (
          <Icon
            height={16}
            width={16}
            onClick={() => setShowPassword((sp) => !sp)}
            className={classes.icon}
            style={{
              width: '1rem',
              height: '1rem',
              color: 'rgba(186, 186, 186, 1)',
            }}
          />
        ) : (
          <></>
        )}
        {type === 'search' ? (
          <Search
            height={16}
            width={16}
            className={classes.icon}
            style={{
              width: '1rem',
              height: '1rem',
              color: 'rgba(186, 186, 186, 1)',
            }}
          />
        ) : (
          <></>
        )}
      </RightSection>
    </Container>
  );
};

export default TextInput;
