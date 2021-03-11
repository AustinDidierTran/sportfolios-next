import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import styles from './ViewTable.module.css';
import Row from './row';

export default function CollapseTable(props) {
  const { data, description, headers, onRowClick, title } = props;
  return (
    <>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      <Table className={styles.table}>
        <TableHead>
          {description && (
            <TableRow>
              <TableCell>{description}</TableCell>
            </TableRow>
          )}
          <TableRow>
            {headers.map((h, index) => (
              <TableCell key={index} width={h.width}>
                {h.display}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((d) => (
            <Row data={d} secondData={d.secondAccount} headers={headers} onRowClick={onRowClick} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
