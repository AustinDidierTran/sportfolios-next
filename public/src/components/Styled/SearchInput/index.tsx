import Search from '@material-ui/icons/Search';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.theme.shadesOfGrey.light};
  border-radius: 44px / 100%;
  padding: 0 1rem 0 1.25rem;
  height: 2.75rem;
  text-align: center;
  width: 100%;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: none;
  text-align: left;

  :focus {
    outline: none;
  }

  ::placeholder {
    color: black;
    opacity: 1;
  }
`;

interface Props {
  autofocus?: boolean;
  value: string;
  onChange: React.ChangeEventHandler;
}

const SearchInput: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const inputElement = useRef(null);

  useEffect(() => {
    if (props.autofocus && inputElement.current) {
      inputElement.current.focus();
    }
  }, []);

  return (
    <Container>
      <Input ref={inputElement} placeholder={t('search.title')} value={props.value || ''} onChange={props.onChange} />
      <Search height={32} width={32} style={{ height: 24, width: 24 }} />
    </Container>
  );
};

export default SearchInput;
