import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import styles from './CollapseTable.module.css';
import { useTranslation } from 'react-i18next';

import Row from './row';

export default function CollapseTable(props) {
  const { t } = useTranslation();
  const { data, description, headers, secondHeaders, onRowClick, title, filter, filterhandler } = props;

  return (
    <>
      <Typography gutterBottom variant="h5" component="h2">
        {title}
      </Typography>
      {filter && (
        <div>
          <TextField onChange={filterhandler} label={t('search')} />
        </div>
      )}
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
          {data.map((d, index) => (
            <Row
              key={index}
              data={d}
              secondData={d.secondAccount}
              headers={headers}
              secondHeaders={secondHeaders}
              onRowClick={onRowClick}
            />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
