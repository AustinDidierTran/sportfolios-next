import React, { useMemo } from 'react';

import { Typography } from '@material-ui/core';
import { IConversationMessage } from '../../../../typescript/conversation';
import CustomAvatar from '../Custom/Avatar';
import styles from './FriendMessage.module.css';
import Tooltip from '@material-ui/core/Tooltip';

interface IProps {
  message: IConversationMessage;
  nickname: string;
}
const FriendMessage: React.FunctionComponent<IProps> = (props) => {
  const { message, nickname } = props;

  const tooltip = useMemo(() => {
    if (nickname) {
      return nickname;
    }
    return `${message.sender.name} ${message.sender.surname}`;
  }, [nickname]);
  //const tooltip = useMemo(() => {}, []);
  return (
    <div className={styles.friends}>
      <Tooltip title={tooltip}>
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
