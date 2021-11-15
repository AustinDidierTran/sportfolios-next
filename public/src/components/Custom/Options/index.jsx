import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { StylesContext } from '@material-ui/styles';
import styles from './Options.module.css';
import ChangeName from '../ChangeName';
import AddParticipants from '../AddParticipants';
import ChangeNickname from '../ChangeNickname';
import RemoveParticipants from '../RemoveParticipants';
import ImageWarningDialog from '../Dialog/ImageWarningDialog';
import AddParticipantsDialog from '../Dialog/AddParticipantsDialog';
import ChangeNameDialog from '../Dialog/ChangeNameDialog';
import ChangeNicknameDialog from '../Dialog/ChangeNicknameDialog';
import RemoveParticipantsDialog from '../Dialog/RemoveParticipantsDialog';
import QuitConvoDialog from '../Dialog/QuitConvoDialog';
import QuitConvo from '../QuitConvo';

export default function Options(props) {
  const { open, anchorEl, handleClose, otherParticipants, conversationId } = props;
  const [openChangeNickname, setOpenChangeNickname] = useState(false);
  const [openChangeName, setOpenChangeName] = useState(false);
  const [openAddParticipants, setOpenAddParticipants] = useState(false);
  const [openRemoveParticipants, setOpenRemoveParticipants] = useState(false);
  const [openQuitConvo, setOpenQuitConvo] = useState(false);
  const handleChangeName = () => {
    console.log('name');
    setOpenChangeName(true);
  };
  const closeChangeName = () => {
    setOpenChangeName(false);
  };
  const handleChangeNickname = () => {
    console.log('nickname');
    setOpenChangeNickname(true);
  };

  const handleQuitConvo = () => {
    console.log('quit');
    setOpenQuitConvo(true);
  };

  const closeQuitConvo = () => {
    setOpenQuitConvo(false);
  };

  const closeChangeNickname = () => {
    setOpenChangeNickname(false);
  };

  const handleAddParticipants = () => {
    console.log('Add');
    setOpenAddParticipants(true);
  };

  const closeAddParticipants = () => {
    setOpenAddParticipants(false);
  };

  const handleRemoveParticipants = () => {
    console.log('Remove');
    setOpenRemoveParticipants(true);
  };

  const closeRemoveParticipants = () => {
    setOpenRemoveParticipants(false);
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
        <MenuItem onClick={handleChangeNickname}>
          <ChangeNickname />
        </MenuItem>
        <MenuItem onClick={handleAddParticipants}>
          <AddParticipants />
        </MenuItem>

        {otherParticipants.length === 1 ? null : (
          <>
            <MenuItem onClick={handleRemoveParticipants}>
              <RemoveParticipants />
            </MenuItem>
            <MenuItem onClick={handleQuitConvo}>
              <QuitConvo />
            </MenuItem>
          </>
        )}
      </Menu>
      <ChangeNameDialog
        open={openChangeName}
        onClose={closeChangeName}
        otherParticipants={otherParticipants}
        conversationId={conversationId}
      />
      <ChangeNicknameDialog
        open={openChangeNickname}
        onClose={closeChangeNickname}
        otherParticipants={otherParticipants}
        conversationId={conversationId}
      />
      <AddParticipantsDialog
        open={openAddParticipants}
        onClose={closeAddParticipants}
        otherParticipants={otherParticipants}
        conversationId={conversationId}
      />
      <RemoveParticipantsDialog
        open={openRemoveParticipants}
        onClose={closeRemoveParticipants}
        otherParticipants={otherParticipants}
        conversationId={conversationId}
      />
      <QuitConvoDialog
        open={openQuitConvo}
        onClose={closeQuitConvo}
        otherParticipants={otherParticipants}
        conversationId={conversationId}
      />
    </div>
  );
}
