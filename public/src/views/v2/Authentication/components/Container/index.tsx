import styled from 'styled-components';

const Container = styled.div`
  font-family: ${(props) => props.theme.text.font};
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  padding: 2.5rem 1.5rem;
  gap: 4rem;
`;

export default Container;
