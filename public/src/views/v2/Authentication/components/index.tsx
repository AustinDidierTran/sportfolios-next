import styled from 'styled-components';

export const DescriptionText = styled.p`
  font-size: 0.6875rem;
  color: ${(props) => props.theme.primary.main};
  text-align: center;
`;

export const ErrorText = styled.span`
  font-size: 0.75rem;
  color: red;
  text-align: left;
  margin-top: 1rem;
`;

export const ActionText = styled.span`
  color: ${(props) => props.theme.text.link};
  font-size: 0.75rem;
`;
