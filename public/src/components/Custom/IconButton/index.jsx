import React from 'react';

import CustomIcon from '../Icon';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { COLORS } from '../../../utils/colors';

export default function CustomIconButton(props) {
  const {
    icon = 'Add',
    onClick = () => {},
    size = 'small',
    tooltip = '',
    fontSize = 'medium',

    // badge props
    withBadge = false,
    badgeColor = 'error',
    badgeContent = 0,

    ...otherProps
  } = props;

  if (withBadge) {
    return (
      <Tooltip title={tooltip}>
        <div>
          <IconButton size={size} onClick={onClick} {...otherProps} style={{ color: COLORS.white, ...props.style }}>
            <Badge invisible={!badgeContent} badgeContent={badgeContent} color={badgeColor}>
              <CustomIcon icon={icon} fontSize={fontSize} />
            </Badge>
          </IconButton>
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltip}>
      <div>
        <IconButton size={size} onClick={onClick} {...otherProps} style={{ color: COLORS.white, ...props.style }}>
          <CustomIcon icon={icon} fontSize={fontSize} />
        </IconButton>
      </div>
    </Tooltip>
  );
}
