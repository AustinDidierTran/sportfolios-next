import styled from 'styled-components';

const MainContent = styled.div`
  position: relative;
  font-family: ${(props) => props.theme.text.font};
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 700px;
  flex: 1;
  overflow-y: scroll;
`;

export default MainContent;
