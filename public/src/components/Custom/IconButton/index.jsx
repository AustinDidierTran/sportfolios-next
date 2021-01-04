import React from 'react';

import { Icon } from '../../Custom';
import { Badge, IconButton, Tooltip } from '@material-ui/core';

export default function CustomIconButton(props) {
  const {
    icon = 'Add',
    onClick = () => {},
    size = 'small',
    tooltip = '',
    fontSize = 'default',

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
          <IconButton size={size} onClick={onClick} {...otherProps} style={{ color: '#fff', ...props.style }}>
            <Badge invisible={!badgeContent} badgeContent={badgeContent} color={badgeColor}>
              <Icon icon={icon} fontSize={fontSize} />
            </Badge>
          </IconButton>
        </div>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={tooltip}>
      <div>
        <IconButton size={size} onClick={onClick} {...otherProps} style={{ color: '#fff', ...props.style }}>
          <Icon icon={icon} fontSize={fontSize} />
        </IconButton>
      </div>
    </Tooltip>
  );
}
