import React from 'react';

import { Typography } from '@material-ui/core';
import { IConversationMessage } from '../../../../typescript/conversation';
import CustomAvatar from '../Custom/Avatar';
import styles from './FriendMessage.module.css';
import Tooltip from '@material-ui/core/Tooltip';

interface IProps {
  message: IConversationMessage;
}
const FriendMessage: React.FunctionComponent<IProps> = (props) => {
  const { message } = props;

  return (
    <div className={styles.friends}>
      <Tooltip title={`${message.sender.name} ${message.sender.surname}`}>
        <div>
          <CustomAvatar className={styles.avatar} size="sm" photoUrl={message.sender.photoUrl} />
        </div>
      </Tooltip>
      <div className={styles.bubble}>
        <Typography variant="body2" className={styles.text}>
          {message.content}
        </Typography>
      </div>
    </div>
  );
};
export default FriendMessage;
