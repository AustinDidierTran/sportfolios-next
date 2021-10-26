import React from 'react';
import { composeInitialProps, useTranslation } from 'react-i18next';
import { ListItemText, Typography } from '@material-ui/core';
import moment from 'moment';
import { Conversation, Message } from '../../../../typescript/conversation';
import CustomAvatar from '../Custom/Avatar';
import styles from './FriendMessage.module.css';

interface IProps {
  message: Message;
}
const MyMessage: React.FunctionComponent<IProps> = (props) => {
  const { message } = props;
  console.log(message.sender.name, ': in friend message');
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
