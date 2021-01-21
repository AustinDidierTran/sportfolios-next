import React from 'react';
import { TableCell } from '@material-ui/core';
import CustomButton from '../../../Button';
import CustomIconButton from '../../../IconButton';
import { goTo } from '../../../../../actions/goTo';
import Switch from '@material-ui/core/Switch';

export default function TableFactory(props) {
  const { d, h } = props;

  if (h.type === 'button') {
    return (
      <TableCell>
        <CustomButton
          className={styles.button}
          onClick={() => {
            goTo(d.buttonRoute, d.id);
          }}
        >
          {d[h.value]}
        </CustomButton>
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
        ></Switch>
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
  return <TableCell>{d[h.value]}</TableCell>;
}
