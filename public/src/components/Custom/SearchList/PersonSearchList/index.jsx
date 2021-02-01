import React, { useMemo } from 'react';

import { useApiRoute } from '../../../../hooks/queries';
import { useFormInput } from '../../../../hooks/forms';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM } from '../../../../../common/enums';
import { formatRoute } from '../../../../../common/utils/stringFormat';
import CustomTextField from '../../TextField';
import CustomIcon from '../../Icon';
import PersonList from './PersonList';

export default function PersonSearchList(props) {
  const {
    blackList,
    whiteList,
    label,
    onClick,
    rejectedTypes = [],
    withoutIcon,
    secondary,
    style,
    autoFocus,
    inputRef,
  } = props;
  const { t } = useTranslation();
  const query = useFormInput('');

  const optionsRoute = useMemo(() => {
    if (!query.value) {
      return;
    }
    const body = {
      query: query.value,
      type: GLOBAL_ENUM.PERSON,
    };
    if (whiteList) {
      body.whiteList = JSON.stringify(whiteList);
    }
    if (blackList) {
      body.blackList = JSON.stringify(blackList);
    }
    const res = formatRoute('/api/data/search/global', null, body);
    return res;
  }, [query]);

  const { response } = useApiRoute(optionsRoute, {
    defaultValue: { entities: [] },
  });
  const handleClick = (e) => {
    onClick(e);
    query.reset();
  };

  const options = useMemo(() => {
    return response.entities
      .filter((entity) => !rejectedTypes.includes(entity.type))
      .map((e) => ({
        ...e,
        secondary,
        onClick: () => {
          handleClick(e);
        },
        key: e.id,
      }));
  }, [response]);

  const handleChange = (value) => {
    if (value.length > 64) {
      query.setError(t('max_length'));
    } else {
      query.setError(null);
      query.onChange(value);
    }
  };

  const onEnter = (e) => {
    if (e.key === 'Enter' && options?.length) {
      onClick(options[0]);
    }
  };
  return (
    <>
      {withoutIcon ? (
        <CustomTextField
          {...query.inputProps}
          onChange={handleChange}
          variant="outlined"
          size="small"
          label={label}
          autoFocus={autoFocus}
          style={{ width: '100%', ...style }}
          onKeyPress={onEnter}
          inputRef={inputRef}
        />
      ) : (
        <CustomTextField
          {...query.inputProps}
          variant="outlined"
          label={label}
          style={{ margin: '8px', ...style }}
          size="small"
          autoFocus={autoFocus}
          onKeyPress={onEnter}
          inputRef={inputRef}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CustomIcon icon="Search" />
              </InputAdornment>
            ),
          }}
        />
      )}
      {query.value.length === 0 ? <></> : <PersonList items={options}></PersonList>}
    </>
  );
}
