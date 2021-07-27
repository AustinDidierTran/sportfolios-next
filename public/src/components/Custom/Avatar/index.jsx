import React from 'react';

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

export default function CustomAvatar(props) {
  const { initials, photoUrl, icon, ...otherProps } = props;
  const classes = useStyles();

  let className = clsx(styles.avatar, props.className);
  if (props.size === 'sm') {
    className = clsx(styles.avatar, styles.sm, props.className);
  } else if (props.size === 'md') {
    className = clsx(styles.avatar, styles.md, props.className);
  } else if (props.size === 'lg') {
    className = clsx(styles.lg, styles.avatar, props.className);
  }
  if (photoUrl) {
    return (
      <Avatar {...otherProps} className={[className, classes.white].join(' ')} src={photoUrl} alt={initials}>
        {initials}
      </Avatar>
    );
  }

  if (icon) {
    return (
      <Avatar {...otherProps} className={className} alt={initials}>
        <CustomIcon icon={icon} />
      </Avatar>
    );
  }

  return (
    <Avatar {...otherProps} className={className}>
      {initials}
    </Avatar>
  );
}
