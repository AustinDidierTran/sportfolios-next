import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 5.5rem;
  padding: 1.5rem 1.5rem;
  gap: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  max-width: ${(props) => props.theme.breakpoints.container};
  margin-left: auto;
  margin-right: auto;
`;

interface Props {
  style?: React.CSSProperties;
}

const MainHeader: React.FunctionComponent<Props> = (props) => {
  return <Container style={props.style}>{props.children}</Container>;
};

export default MainHeader;
