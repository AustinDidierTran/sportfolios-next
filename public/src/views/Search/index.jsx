import React, { useEffect, useState } from 'react';

import { IgContainer, LoadingSpinner } from '../../components/Custom';

import EntitySearch from './EntitySearch/index';

import api from '../../actions/api';
import { formatRoute } from '../../actions/goTo';
import { useRouter } from 'next/router';

export default function Search(props) {
  const router = useRouter();
  const { query } = router.query;

  const { type } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [entities, setEntities] = useState([]);
  const [timeoutRef, setTimeoutRef] = useState(null);
  const asyncFetchResult = async () => {
    const res = await api(formatRoute('/api/data/search/global', null, { query, type }));

    setEntities(res.data.entities);

    setTimeoutRef(null);
    setIsLoading(false);
  };

  const fetchSearchResults = () => {
    setIsLoading(true);
    if (timeoutRef) {
      clearTimeout(timeoutRef);
    }
    setTimeoutRef(setTimeout(asyncFetchResult, 1000));
  };

  useEffect(() => {
    fetchSearchResults();
  }, [query]);

  if (isLoading) {
    return (
      <IgContainer>
        <LoadingSpinner />
      </IgContainer>
    );
  }

  return (
    <IgContainer>
      <EntitySearch query={query} entities={entities} />
    </IgContainer>
  );
}
