import React from 'react';
import { Typography } from '@material-ui/core';
import { IConversationMessage } from '../../../../typescript/conversation';
import styles from './MyMessage.module.css';

interface IProps {
  message: IConversationMessage;
}
const MyMessage: React.FunctionComponent<IProps> = (props) => {
  const { message } = props;
  console.log('inside my message');
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
