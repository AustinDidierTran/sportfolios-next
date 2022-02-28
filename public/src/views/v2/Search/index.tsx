import React, { useCallback, useEffect, useMemo, useState } from 'react';
import MainFooter from '../common/MainLayout/Footer';
import MainContainer from '../common/MainLayout/Container';
import MainContent from '../common/MainLayout/Content';
import MainHeader from '../common/MainLayout/Header';
import { KeyboardArrowLeft } from '@material-ui/icons';
import SearchInput from '../../../components/Styled/SearchInput';
import { useRouter } from 'next/router';
import { formatRoute } from '../../../utils/stringFormats';
import { ROUTES_ENUM } from '../../../../common/enums';
import styled from 'styled-components';
import { getGlobalSearch } from '../../../actions/service/search';
import { EntityType } from '../../../../../typescript/entity';
import Card from './components/Card';
import { useTranslation } from 'react-i18next';

const SearchResults = styled.div`
  padding: 0.5rem 0.5rem 8rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchTabs = styled.div`
  padding: 0 0.5rem;
  display: flex;
  flex-direction: row;
`;

const Tab = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const TabText = styled.div`
  border-radius: 0.3125rem;
  padding: 0.3125rem 0.75rem;
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: auto;
  margin-right: auto;
  color: ${(props) => (props.color === 'active' ? 'inherit' : 'inherit')};
  background-color: ${(props) => (props.color === 'active' ? '#e5e5e5' : 'none')};
  text-align: center;
`;

export interface SearchResult {
  id: string;
  type: EntityType;
  photoUrl: string;
  name?: string;
  completeName?: string;
}

const SearchView: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { query, type } = router.query;
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const onBack = useCallback(() => {
    router.back();
  }, []);

  const onTabClick = useCallback(
    (newType) => {
      const newRoute = (() => {
        if (!query) {
          return formatRoute(ROUTES_ENUM.search, null, { type: newType });
        }

        return formatRoute(ROUTES_ENUM.search, null, { query, type: newType });
      })();

      router.replace(newRoute);
    },
    [query]
  );

  useEffect(() => {
    if (!type) {
      if (!query) {
        router.replace(formatRoute(ROUTES_ENUM.search, null, { type: 'all' }));
      } else {
        router.replace(formatRoute(ROUTES_ENUM.search, null, { query, type: 'all' }));
      }
    }
  }, [type, query]);

  useEffect(() => {
    if (!query) {
      return;
    }

    getGlobalSearch(query as string, type === 'all' ? null : (type as EntityType)).then((data) => {
      setSearchResults(data);
    });
  }, [type, query]);

  const onSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newRoute = (() => {
        if (!event.target.value) {
          return formatRoute(ROUTES_ENUM.search, null, { type });
        }
        const newQuery = encodeURIComponent(event.target.value);

        return formatRoute(ROUTES_ENUM.search, null, { query: newQuery, type });
      })();

      router.replace(newRoute);
    },
    [type]
  );

  const searchValue = useMemo(() => {
    if (!query) {
      return '';
    }

    return decodeURIComponent(query as string);
  }, [query]);

  const tabs = useMemo(
    () => [
      {
        label: t('search.all'),
        value: 'all',
      },
      {
        label: t('search.events'),
        value: EntityType.EVENT,
      },
      {
        label: t('search.people'),
        value: EntityType.PERSON,
      },
      {
        label: t('search.organizations'),
        value: EntityType.ORGANIZATION,
      },
    ],
    []
  );

  return (
    <MainContainer>
      <MainHeader>
        <KeyboardArrowLeft style={{ height: 32, width: 32, cursor: 'pointer' }} onClick={onBack} />
        <SearchInput autofocus value={searchValue} onChange={onSearchChange} />
      </MainHeader>
      <MainContent>
        <SearchTabs>
          {tabs.map((tab) => (
            <Tab onClick={() => onTabClick(tab.value)} key={tab.value}>
              <TabText color={tab.value === type ? 'active' : ''}>{tab.label}</TabText>
            </Tab>
          ))}
        </SearchTabs>
        <SearchResults>
          {searchResults.map((result) => (
            <Card key={result.id} result={result} />
          ))}
        </SearchResults>
      </MainContent>
      <MainFooter />
    </MainContainer>
  );
};

export default SearchView;
