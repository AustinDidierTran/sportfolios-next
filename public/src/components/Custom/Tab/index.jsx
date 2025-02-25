import React from 'react';
import Tab from '@material-ui/core/Tab';
import CustomIcon from '../Icon';
import { useWindowSize } from '../../../hooks/window';
import { MOBILE_WIDTH } from '../../../../common/constants';

export default function CustomTab(props) {
  const { icon, label, onClick } = props;
  const [width] = useWindowSize();

  if (width > MOBILE_WIDTH) {
    return <Tab icon={<CustomIcon icon={icon} />} label={label} onClick={onClick} />;
  }

  return <Tab icon={<CustomIcon icon={icon} />} aria-label={label} onClick={onClick} />;
}
