import styled from 'styled-components';

const Content = styled.div`
  font-family: Montserrat;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  h3 {
    color: #22b995;
    font-size: 1.5rem;
  }

  & > p {
    margin-top: 1.625rem;
    font-size: 0.75rem;
  }

  & > p > a {
    color: rgba(45, 197, 168, 1);
  }
`;

export default Content;
