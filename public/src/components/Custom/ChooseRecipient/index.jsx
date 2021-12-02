import React, { useState, useContext, useMemo } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ManageParticipants from '../ManageParticipants';
import CustomAvatar from '../Avatar';
import { useTranslation } from 'react-i18next';
import styles from './ChooseRecipient.module.css';
import { Store } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';
import Typography from '@material-ui/core/Typography';
import { updateConversationName } from '../../../actions/service/messaging';

export default function ChooseRecipient(props) {
  const { t } = useTranslation();
  const { open, anchorEl, handleClose, recipientOptions, updateConversations } = props;

  const handleNewRecipient = (newRecipient) => {
    goTo(ROUTES.conversations, null, { recipientId: newRecipient.id });
  };

  return (
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      onClick={handleClose}
      getContentAnchorEl={null}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {recipientOptions?.map((r) => (
        <MenuItem onClick={() => handleNewRecipient(r)}>
          <div className={styles.item}>
            <CustomAvatar photoUrl={r.photoUrl} />
            <Typography className={styles.writing} variant="body1">
              {`${r.name}`}
            </Typography>
          </div>
        </MenuItem>
      ))}
    </Menu>
  );
}
