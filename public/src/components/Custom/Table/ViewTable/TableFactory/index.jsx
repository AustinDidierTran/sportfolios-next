import React, { useContext, useState } from 'react';

import TableCell from '@material-ui/core/TableCell';
import CustomButton from '../../../Button';
import CustomIconButton from '../../../IconButton';
import { goTo } from '../../../../../actions/goTo';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import { ENTITIES_ROLE_ENUM, Store } from '../../../../../Store';
import { updateUserRole } from '../../../../../actions/service/entity/post';
import AlertDialog from '../../../Dialog/AlertDialog';
import { useTranslation } from 'react-i18next';

export default function TableFactory(props) {
  const { d, h, width = false, onClick } = props;
  const {
    state: { userInfo },
  } = useContext(Store);
  const { t } = useTranslation();

  const [alertIsOpen, setAlertIsOpen] = useState(false);

  async function handleUpdateRole(userId, role) {
    if (userInfo.userId === userId && role === ENTITIES_ROLE_ENUM.VIEWER) {
      setAlertIsOpen(true);
    } else {
      await updateUserRole(userId, role);
    }
  }
  if (h.type === 'button') {
    return (
      <TableCell>
        <CustomButton
          onClick={() => {
            goTo(d.buttonRoute, d.id);
          }}
        >
          {d[h.value]}
        </CustomButton>
      </TableCell>
    );
  }

  if (h.type === 'adminButton') {
    return (
      <TableCell>
        <>
          {d[h.value] === ENTITIES_ROLE_ENUM.ADMIN ? (
            <CustomButton color="secondary" onClick={() => handleUpdateRole(d.id, ENTITIES_ROLE_ENUM.VIEWER)}>
              {t('remove_admin')}
            </CustomButton>
          ) : (
            <CustomButton color="primary" onClick={() => handleUpdateRole(d.id, ENTITIES_ROLE_ENUM.ADMIN)}>
              {t('add.add_admin')}
            </CustomButton>
          )}
          <AlertDialog
            open={alertIsOpen}
            title={t('warning')}
            description={t('you_will_lose_your_role')}
            onSubmit={async () => {
              await updateUserRole(d.id, ENTITIES_ROLE_ENUM.VIEWER);
              setAlertIsOpen(false);
              location.reload();
            }}
            onCancel={() => setAlertIsOpen(false)}
          />
        </>
      </TableCell>
    );
  }

  if (h.type === 'toggle') {
    return (
      <TableCell>
        <Switch
          name={d.name}
          checked={d.isChecked}
          onChange={d.handleChange}
          inputProps={d.inputProps}
          color={d.color}
        />
      </TableCell>
    );
  }
  if (h.type === 'iconButton') {
    return (
      <TableCell>
        <CustomIconButton onClick={d.onIconButtonClick} icon={d.icon} style={{ color: 'primary' }} />
      </TableCell>
    );
  }

  if (h.type === 'avatar') {
    return (
      <TableCell width={width ? h.width : false} onClick={onClick && onClick(d)}>
        <Avatar src={d[h.value]} />
      </TableCell>
    );
  }
  return (
    <TableCell width={width ? h.width : false} onClick={onClick && onClick(d)}>
      {d[h.value]}
    </TableCell>
  );
}
