import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import CustomAvatar from '../../Avatar';
import styles from './RecipientOption.module.css';
import { seeMessages } from '../../../../actions/service/messaging';
import { goTo, ROUTES } from '../../../../actions/goTo';
import Typography from '@material-ui/core/Typography';

export default function RecipientOption(props) {
  const { recipientOption, setRecipientOptions } = props;
  const handleNewRecipient = () => {
    seeMessages(recipientOption.id).then(() => {
      setRecipientOptions((oldRecipientOptions) => {
        const newRecipientOptions = [...oldRecipientOptions];
        const index = newRecipientOptions.map((r) => r.id).indexOf(recipientOption.id);
        newRecipientOptions[index].unreadMessagesAmount = 0;
        return newRecipientOptions;
      });
      goTo(ROUTES.conversations, null, { recipientId: recipientOption.id });
    });
  };

  return (
    <MenuItem onClick={handleNewRecipient}>
      <div className={styles.item}>
        <CustomAvatar
          photoUrl={recipientOption.photoUrl}
          withBadge
          badgeContent={recipientOption.unreadMessagesAmount}
        />
        <Typography className={styles.writing} variant="body1">
          {recipientOption.name}
        </Typography>
      </div>
    </MenuItem>
  );
}
