import React from 'react';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';

import CustomAvatar from '../Avatar';

import styles from './ProfileChip.module.css';
import { getInitialsFromName } from '../../../utils/stringFormats';
import { goTo, ROUTES } from '../../../actions/goTo';

const useStyles = makeStyles({
  avatar: {
    width: '30px !important',
    height: '30px !important',
    borderWidth: '3px !important',
  },
  noBorder: {
    border: 'none',
  },
});

export default function ProfileChip(props) {
  const classes = useStyles();
  const { photoUrl, nameObj, entityId } = props;

  return (
    <Chip
      className={styles.chip}
      label={nameObj.name}
      avatar={
        <CustomAvatar
          className={photoUrl ? [classes.avatar, classes.noBorder].join(' ') : classes.avatar}
          photoUrl={photoUrl}
          initials={getInitialsFromName(nameObj)}
        />
      }
      variant="outlined"
      onClick={() =>
        goTo(ROUTES.entity, {
          id: entityId,
        })
      }
    />
  );
}
