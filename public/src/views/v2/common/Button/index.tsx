import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  width: fit-content;
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;

  background-color: white;
  border: none;
  color: ${(props) => props.theme.shadesOfGrey.dark};

  &[color='primary'] {
    background-color: ${(props) => props.theme.primary.main};
    color: white;
    border: none;
  }

  &[color='outlined'] {
    background-color: white;
    color: ${(props) => props.theme.primary.main};
    border: ${(props) => `1px solid ${props.theme.primary.main}`};
  }

  &[disabled] {
    cursor: initial;
    color: white;
    background-color: ${(props) => props.theme.shadesOfGrey.primary};
    border: none;
  }
`;

export default Button;
