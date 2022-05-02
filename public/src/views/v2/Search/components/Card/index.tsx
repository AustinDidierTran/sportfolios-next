import { AccountCircle } from '@material-ui/icons';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { SearchResult } from '../..';
import { goTo, ROUTES } from '../../../../../actions/goTo';

interface Props {
  result: SearchResult;
}

const Container = styled.div`
  cursor: pointer;
  border-radius: 0.75rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  padding: 0.5rem 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
`;

const Image = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
`;

const NameText = styled.span`
  font-weight: 700;
  flex: 1;
`;

const MissingPhoto = styled.div`
  background-color: ${(props) => props.theme.primary.main};
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;

  & > svg {
    height: 50%;
    width: 50%;
  }
`;

const Card: React.FunctionComponent<Props> = (props) => {
  const { result } = props;

  const onClick = useCallback(() => {
    goTo(ROUTES.entity, { id: result.id });
  }, [result.id]);

  return (
    <Container onClick={onClick}>
      {result.photoUrl ? (
        <Image src={result.photoUrl} />
      ) : (
        <MissingPhoto>
          <AccountCircle />
        </MissingPhoto>
      )}
      <NameText>{result.name || result.completeName}</NameText>
    </Container>
  );
};

export default Card;
