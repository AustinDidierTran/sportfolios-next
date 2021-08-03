import React, { useEffect, useState } from 'react';

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
  const { searchQuery = '/api/search/previous', type } = props;
  const router = useRouter();
  const location = router.pathname;
  const { query: queryQuery } = router.query;

  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (query) {
      getPreviousSearchQueries();
    }
  }, [query]);

  const getPreviousSearchQueries = async () => {
    const { data } = await api(searchQuery, { method: 'GET' });
    if (data) {
      setOptions(data.map((ar) => ({ value: ar, display: ar })));
    }
    setOptions([]);
  };

  const [query, setQuery] = useState(queryQuery);

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
