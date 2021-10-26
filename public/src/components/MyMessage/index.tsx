import React from 'react';
import { useTranslation } from 'react-i18next';
import { ListItemText, Typography } from '@material-ui/core';
import moment from 'moment';
import { Conversation, Message } from '../../../../typescript/conversation';
import styles from './MyMessage.module.css';

interface IProps {
  message: Message;
}
const MyMessage: React.FunctionComponent<IProps> = (props) => {
  const { message } = props;
  console.log(message.sender.name, ': in my message');
  return (
    <div className={styles.me}>
      <div className={styles.bubble}>
        <Typography variant="body2" className={styles.text}>
          {message.content}
        </Typography>
      </div>
    </div>
  );
};
export default MyMessage;
