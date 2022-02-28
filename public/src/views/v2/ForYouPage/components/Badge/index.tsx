import React from 'react';
import styled from 'styled-components';

interface Props {
  count: number;
  onClick: () => void;
  position?: string;
}

const Container = styled.div`
  position: relative;
  cursor: pointer;
`;

const Pill = styled.div`
  position: absolute;
  width: 1rem;
  height: 1rem;
  font-size: 0.625rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ff003b;
  color: white;
`;

const Badge: React.FunctionComponent<Props> = (props) => {
  return (
    <Container onClick={props.onClick}>
      {props.count > 0 ? <Pill style={{ right: props.position === 'right' ? 0 : null }}>{props.count}</Pill> : <></>}
      {props.children}
    </Container>
  );
};

export default Badge;
