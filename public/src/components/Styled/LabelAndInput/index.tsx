import React, { ReactElement } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Label = styled.span`
  color: ${(props) => props.theme.shadesOfGrey.dark};
  width: 7rem;
  font-size: 0.75rem;
`;

const ChildrenContainer = styled.div`
  flex: 1;
`;

interface Props {
  label: string;
  children: ReactElement;
}

const LabelAndInput: React.FunctionComponent<Props> = (props) => {
  return (
    <Container>
      <Label>{props.label}</Label>
      <ChildrenContainer>{props.children}</ChildrenContainer>
    </Container>
  );
};

export default LabelAndInput;
