import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import MemberImportItem from './MemberImportItem';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export default function MembersImportList(props) {
  const { title, items, ref, rowRenderer, selectedIndex, ...otherProps } = props;

  const classes = useStyles();

  const defaultRowRenderer = (item, index) => {
    return (
      <MemberImportItem
        {...otherProps}
        {...item}
        index={index}
        key={item?.key || index}
        selected={selectedIndex === index}
      />
    );
  };

  return (
    <List
      {...otherProps}
      ref={ref}
      style={{ maxWidth: 'unset' }}
      aria-labelledby="nested-list-subheader"
      subheader={
        title ? (
          <ListSubheader component="div" id="nested-list-subheader">
            {title}
          </ListSubheader>
        ) : (
          <></>
        )
      }
      className={classes.root}
      disablePadding
    >
      {items && items.map(rowRenderer || defaultRowRenderer)}
    </List>
  );
}
