import React from 'react';
import Container from '@material-ui/core/Container';

export default function CustomContainer(props) {
  const [gutters, setGutters] = React.useState(false);

  const handleResize = () => {
    setGutters(Boolean(window.innerWidth < 768));
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
