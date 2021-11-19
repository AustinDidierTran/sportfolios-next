import React, { useState } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ChangeName from '../ChangeName';
import ChangeNameDialog from '../Dialog/ChangeNameDialog';
import QuitConvoDialog from '../Dialog/QuitConvoDialog';
import QuitConvo from '../QuitConvo';
import ManageParticipants from '../ManageParticipants';
import ManageParticipantsDialog from '../Dialog/ManageParticipantsDialog';

export default function Options(props) {
  const { open, anchorEl, handleClose, otherParticipants, conversationId } = props;
  const [openManageParticipants, setOpenManageParticipants] = useState(false);
  const [openChangeName, setOpenChangeName] = useState(false);
  const [openQuitConvo, setOpenQuitConvo] = useState(false);
  const handleChangeName = () => {
    setOpenChangeName(true);
  };
  const closeChangeName = () => {
    setOpenChangeName(false);
  };
  const handleManageParticipants = () => {
    setOpenManageParticipants(true);
  };

  const closeManageParticipants = () => {
    setOpenManageParticipants(false);
  };

  const handleQuitConvo = () => {
    setOpenQuitConvo(true);
  };

  const closeQuitConvo = () => {
    setOpenQuitConvo(false);
  };

  return (
    <div>
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
        <MenuItem onClick={handleChangeName}>
          <ChangeName />
        </MenuItem>
        <MenuItem onClick={handleManageParticipants}>
          <ManageParticipants />
        </MenuItem>

        {otherParticipants.length === 1 ? null : (
          <MenuItem onClick={handleQuitConvo}>
            <QuitConvo />
          </MenuItem>
        )}
      </Menu>
      <ChangeNameDialog open={openChangeName} onClose={closeChangeName} conversationId={conversationId} />
      <ManageParticipantsDialog
        open={openManageParticipants}
        onClose={closeManageParticipants}
        otherParticipants={otherParticipants}
        conversationId={conversationId}
      />
      <QuitConvoDialog open={openQuitConvo} onClose={closeQuitConvo} conversationId={conversationId} />
    </div>
  );
}
