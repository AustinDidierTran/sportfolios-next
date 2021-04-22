import React, { useState, useEffect } from 'react';
import Tab from '@material-ui/core/Tab';
import CustomIcon from '../Icon';
import { useWindowSize } from '../../../hooks/window';

export default function CustomTab(props) {
  const { icon, label, onClick } = props;
  const [displayText, setDisplayText] = useState(false);
  const [width] = useWindowSize();


  const handleResize = () => {
    setDisplayText(Boolean(width > 600));
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (displayText) {
    return <Tab icon={<CustomIcon icon={icon} />} label={label} onClick={onClick} />;
  }

  return <Tab icon={<CustomIcon icon={icon} />} aria-label={label} onClick={onClick} />;
}
