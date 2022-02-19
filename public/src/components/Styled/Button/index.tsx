import styled from 'styled-components';

const Button = styled.button`
  cursor: pointer;
  border-radius: 0.75rem;
  background-color: ${(props) => (props.disabled ? props.theme.shadesOfGrey.primary : props.theme.primary.main)};
  padding: 0.5rem;
  border: none;
  color: white;
`;

export default Button;
