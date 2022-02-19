import React, { ReactElement } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 0.75rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  padding: 0.75rem;
  width: 100%;
  gap: 1.75rem;

  font-size: 0.875rem;
  font-weight: bold;
  margin-top: 1rem;
`;

const Icon = styled.span`
  width: 1.375rem;
  height: 1.375rem;
`;

interface Props {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  children: ReactElement;
  label: string;
}

const LoginCard: React.FunctionComponent<Props> = (props) => {
  return (
    <Container onClick={props.onClick}>
      <Icon>{props.children}</Icon>
      {props.label}
    </Container>
  );
};

export default LoginCard;
