import React, { useEffect, useMemo, useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import CustomAutocomplete from '../Autocomplete';
import { goTo, goToAndReplace, ROUTES } from '../../../actions/goTo';

import styles from './SearchInput.module.css';
import { useRouter } from 'next/router';
import api from '../../../actions/api';

const useStyles = makeStyles((theme) => ({
  inputRoot: {
    color: theme.palette.common.white,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      minWidth: 240,
    },
  },
  clearIndicator: {
    color: theme.palette.common.white,
  },
}));

export default function SearchInput(props) {
  const classes = useStyles();
  const { searchQuery = '/api/data/search/previous', type } = props;
  const router = useRouter();
  const location = router.pathname;
  const { query: queryQuery } = router.query;

  const { data: apiRes } = api(searchQuery, { method: 'GET' });

  const [query, setQuery] = useState(queryQuery);

  const options = useMemo(() => {
    if (apiRes) {
      return apiRes.map((ar) => ({ value: ar, display: ar }));
    }
    return [];
  }, [apiRes]);

  useEffect(() => {
    if (query) {
      if (location.pathname === ROUTES.search) {
        goToAndReplace(ROUTES.search, null, { query, type });
      } else {
        goTo(ROUTES.search, null, { query, type });
      }
    }
  }, [query]);

  const onChange = (value) => {
    setQuery(value);
  };

  return (
    <CustomAutocomplete
      classes={classes}
      options={options}
      onChange={onChange}
      freeSolo
      inputProps={{
        className: styles.searchBox,
      }}
      icon="Search"
      iconColor="white"
    />
  );
}
