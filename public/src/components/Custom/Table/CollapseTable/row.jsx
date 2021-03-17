import React, { useState } from 'react';

import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import TableFactory from '../ViewTable/TableFactory';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

export default function Row(props) {
  const { data, secondData, headers: header, onRowClick, secondHeaders } = props;
  const [open, setOpen] = React.useState(false);
  let headers;
  if (secondData.length > 0) {
    headers = header.filter((obj) => {
      return obj.value !== 'collapse';
    });
  } else {
    headers = header;
  }

  return (
    <React.Fragment>
      <TableRow hover={true}>
        {secondData.length > 0 && (
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}
        {headers.map((h, index) => (
          <TableFactory width={true} d={data} h={h} key={index} onClick={onRowClick} />
        ))}
      </TableRow>
      {secondData.length > 0 && (
        <TableRow>
          <TableCell style={{ padding: 0 }} colSpan={header.length}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box style={{ marginTop: 16, marginBottom: 16 }}>
                <Table>
                  {secondData.map((data, index) => (
                    <TableRow key={index}>
                      {secondHeaders.map((h, index) => (
                        <TableFactory width={true} d={data} h={h} key={index} />
                      ))}
                    </TableRow>
                  ))}
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
}
