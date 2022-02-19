import React from 'react';
import Menu from '@material-ui/core/Menu';

import RecipientOption from './RecipientOption';

export default function ChooseRecipient(props) {
  const { open, anchorEl, handleClose, recipientOptions, setRecipientOptions } = props;

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
        <RecipientOption key={r} recipientOption={r} setRecipientOptions={setRecipientOptions} />
      ))}
    </Menu>
  );
}
