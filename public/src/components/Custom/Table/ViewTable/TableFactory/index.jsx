import React from 'react';

import TableCell from '@material-ui/core/TableCell';
import CustomButton from '../../../Button';
import CustomIconButton from '../../../IconButton';
import { goTo } from '../../../../../actions/goTo';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import { ENTITIES_ROLE_ENUM } from '../../../../../Store';
import { updateUserRole } from '../../../../../actions/service/entity/post';

export default function TableFactory(props) {
  const { d, h, width = false, onClick } = props;

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
        {d[h.value] === ENTITIES_ROLE_ENUM.ADMIN ? (
          <CustomButton onClick={async () => await updateUserRole(d.id, ENTITIES_ROLE_ENUM.VIEWER)}>allo</CustomButton>
        ) : (
          <CustomButton onClick={async () => await updateUserRole(d.id, ENTITIES_ROLE_ENUM.ADMIN)}>Babye</CustomButton>
        )}
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
