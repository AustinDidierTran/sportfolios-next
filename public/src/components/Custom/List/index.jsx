import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';

import ItemFactory from './ItemFactory';

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

export default function CustomList(props) {
  const { children, title, items, ref, rowRenderer, selectedIndex, ...otherProps } = props;

  const classes = useStyles();

  const defaultRowRenderer = (item, index) => {
    const Item = ItemFactory({ type: item.type });
    return <Item {...otherProps} {...item} index={index} key={index} selected={selectedIndex === index} />;
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
        ) : null
      }
      className={classes.root}
      disablePadding
    >
      {items && items.map(rowRenderer || defaultRowRenderer)}
      {children}
    </List>
  );
}
