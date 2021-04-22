import React from 'react';
import Container from '@material-ui/core/Container';
import { useWindowSize } from '../../../hooks/window';

export default function CustomContainer(props) {
  const [width] = useWindowSize();

  const [gutters, setGutters] = React.useState(false);

  const handleResize = () => {
    setGutters(Boolean(width < 768));
  };

  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <Container disableGutters={gutters} {...props} />;
}
