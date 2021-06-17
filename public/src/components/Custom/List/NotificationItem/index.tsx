import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

import styles from './NotificationItem.module.css';
import api from '../../../../actions/api';
import { timestampToRelativeTime } from '../../../../utils/stringFormats';
import CustomAvatar from '../../Avatar';
import CustomIcon from '../../Icon';

interface IProps {
  clicked?: boolean;
  description: string;
  photoUrl?: string;
  onClick: () => void;
  initials: string;
  id?: string;
  created_at: string;
  buttons?: JSX.Element[];
}

const NotificationItem: React.FunctionComponent<IProps> = (props) => {
  const { clicked, description, photoUrl, onClick, initials, id, created_at, buttons } = props;

  function handleClick(): void {
    if (!clicked) {
      api('/api/notifications/click', {
        method: 'PUT',
        body: JSON.stringify({
          notificationId: id,
        }),
      });
    }
    onClick();
  }

  return (
    <ListItem classes={{ container: clicked ? styles.old : styles.new }} ContainerProps={{ onClick: handleClick }}>
      <ListItemAvatar>
        <CustomAvatar photoUrl={photoUrl} initials={initials} />
      </ListItemAvatar>
      <ListItemText
        className={styles.text}
        style={{ whiteSpace: 'pre-line' }}
        disableTypography
        primary={<Typography>{description}</Typography>}
        secondary={
          <Typography color="textSecondary" style={{ color: clicked ? 'textSecondary' : '#18b393' }}>
            {timestampToRelativeTime(new Date(created_at))}
          </Typography>
        }
      />
      {clicked ? (
        <></>
      ) : (
        <div className={styles.dot}>
          <CustomIcon icon="Dot" color="#18b393" />
        </div>
      )}

      <ListItemSecondaryAction
        style={{
          justifyContent: 'flex-end',
          display: 'flex',
          position: 'relative',
          transform: 'translateY(-25%)',
          right: '0',
        }}
      >
        {buttons}
      </ListItemSecondaryAction>
    </ListItem>
  );
};
export default NotificationItem;
