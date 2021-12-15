import React, { useState, useContext, useMemo } from 'react';
import Menu from '@material-ui/core/Menu';
import { useTranslation } from 'react-i18next';

import { Store } from '../../../Store';
import { goTo, ROUTES } from '../../../actions/goTo';
import RecipientOption from './RecipientOption';

export default function ChooseRecipient(props) {
  const { t } = useTranslation();
  const { open, anchorEl, handleClose, recipientOptions, setRecipientOptions } = props;
  const {
    state: { userInfo: userInfo, socket },
  } = useContext(Store);

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
        <RecipientOption recipientOption={r} setRecipientOptions={setRecipientOptions} />
      ))}
    </Menu>
  );
}
