import React from 'react';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import CustomIcon from '../Icon';
import clsx from 'clsx';
import styles from './Avatar.module.css';

const useStyles = makeStyles({
  white: {
    backgroundColor: 'white !important',
  },
});

interface IProps {
  photoUrl?: string;
  icon?: string;
  className?: string;
  size?: string;
  variant?: 'circle' | 'circular' | 'rounded' | 'square';
  'aria-label'?: string;
  style?: any;
  namespace?: string;
  withBadge?: Boolean;
  badgeColor?: any;
  badgeContent?: number;
}

const CustomAvatar: React.FunctionComponent<IProps> = (props) => {
  const { withBadge = false, badgeColor = 'error', badgeContent = 0, photoUrl, icon, ...otherProps } = props;
  const classes = useStyles();

  let className = clsx(styles.avatar, props.className);
  let iconStyle = { width: 25, height: 25 };
  if (props.size === 'sm') {
    className = clsx(styles.avatar, styles.sm, props.className);
  } else if (props.size === 'md') {
    className = clsx(styles.avatar, styles.md, props.className);
  } else if (props.size === 'lg') {
    className = clsx(styles.lg, styles.avatar, props.className);
    iconStyle = { width: 80, height: 80 };
  }
  if (photoUrl) {
    return (
      <Badge invisible={!badgeContent} badgeContent={badgeContent} color={badgeColor}>
        <Avatar {...otherProps} className={[className, classes.white].join(' ')} src={photoUrl} />
      </Badge>
    );
  }

  if (icon) {
    return (
      <Badge invisible={!badgeContent} badgeContent={badgeContent} color={badgeColor}>
        <Avatar {...otherProps} className={className}>
          <CustomIcon icon={icon} />
        </Avatar>
      </Badge>
    );
  }

  return (
    <Badge invisible={!badgeContent} badgeContent={badgeContent} color={badgeColor}>
      <Avatar {...otherProps} className={className}>
        <CustomIcon style={iconStyle} icon={'Person'} />
      </Avatar>
    </Badge>
  );
};
export default CustomAvatar;
