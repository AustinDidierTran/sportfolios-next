import React from 'react';
import { Typography } from '@material-ui/core';
import { Message } from '../../../../typescript/conversation';
import styles from './MyMessage.module.css';

interface IProps {
  message: Message;
}
const MyMessage: React.FunctionComponent<IProps> = (props) => {
  const { message } = props;
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
