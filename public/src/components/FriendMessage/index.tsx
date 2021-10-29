import React from 'react';

import { Typography } from '@material-ui/core';
import { IConversationMessage } from '../../../../typescript/conversation';
import CustomAvatar from '../Custom/Avatar';
import styles from './FriendMessage.module.css';

interface IProps {
  message: IConversationMessage;
}
const MyMessage: React.FunctionComponent<IProps> = (props) => {
  const { message } = props;

  return (
    <div className={styles.friends}>
      <CustomAvatar className={styles.avatar} size="sm" photoUrl={message.sender.photoUrl} />
      <div className={styles.bubble}>
        <Typography variant="body2" className={styles.text}>
          {message.content}
        </Typography>
      </div>
    </div>
  );
};
export default MyMessage;
