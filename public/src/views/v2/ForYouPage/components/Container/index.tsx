import styled from 'styled-components';

const HomeContainer = styled.div`
  position: relative;
  font-family: ${(props) => props.theme.text.font};
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 700px;
  flex: 1;
  padding: 0.5rem 0.5rem;
  gap: 4rem;
  overflow-y: scroll;
`;

export default HomeContainer;
