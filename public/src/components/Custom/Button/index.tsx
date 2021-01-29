import React, { useMemo } from 'react';

import Button, { ButtonProps } from '@material-ui/core/Button';
import CustomIcon from '../Icon';

interface IProps extends ButtonProps {
  textColor?: string;
  startIcon?: any;
  endIcon?: any;
}

const CustomButton: React.FC<IProps> = (props) => {
  const { color = 'primary', variant = 'contained', size = 'small', textColor, style, ...otherProps } = props;

  let defaultTextColor = 'white';
  if (variant === 'outlined' || variant === 'text') {
    defaultTextColor = 'primary';
  }

  const startIcon = useMemo(() => {
    if (!props.startIcon) {
      return null;
    }
    return <CustomIcon icon={props.startIcon} />;
  }, [props.startIcon]);

  const endIcon = useMemo(() => {
    if (!props.endIcon) {
      return null;
    }
    return <CustomIcon icon={props.endIcon} />;
  }, [props.endIcon]);

  return (
    <Button
      {...otherProps}
      variant={variant}
      style={{
        color: textColor || defaultTextColor,
        ...style,
      }}
      color={color}
      size={size}
      startIcon={startIcon}
      endIcon={endIcon}
    />
  );
};

export default CustomButton;
