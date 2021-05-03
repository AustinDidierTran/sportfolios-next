import React, { useMemo } from 'react';
import Container from '@material-ui/core/Container';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';

export default function CustomContainer(props) {
  const [width] = useWindowSize();

  const gutters = useMemo(() => width < MOBILE_WIDTH, [width]);

  return <Container disableGutters={gutters} {...props} />;
}
