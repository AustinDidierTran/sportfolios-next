import { CircularProgress } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const CenterOnPage = styled.div`
  height: calc(100vh - 11rem);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenteredLoadingSpinner: React.FunctionComponent = () => {
  return (
    <CenterOnPage>
      <CircularProgress />
    </CenterOnPage>
  );
};

export default CenteredLoadingSpinner;
