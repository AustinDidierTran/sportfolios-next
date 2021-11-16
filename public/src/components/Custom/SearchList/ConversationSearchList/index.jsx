import React, { useEffect, useState, useContext } from 'react';

import { useFormInput } from '../../../../hooks/forms';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import { GLOBAL_ENUM, REQUEST_STATUS_ENUM } from '../../../../../common/enums';
import CustomTextField from '../../TextField';
import CustomIcon from '../../Icon';
import ConversationList from './ConversationList';
import { globalSearch } from '../../../../actions/service/entity/get';
import { getConversations } from '../../../../actions/service/messaging';
import { Store } from '../../../../Store';

export default function ConversationSearchList(props) {
  const { label, onClick, rejectedTypes = [], withoutIcon, secondary, style, autoFocus, inputRef } = props;
  const { t } = useTranslation();
  const query = useFormInput('');
  const [options, setOptions] = useState([]);
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);

  useEffect(() => {
    getOptions();
  }, [query.value]);

  const getOptions = async () => {
    if (!query.value) {
      setOptions([]);
    }
    const data = await getConversations({ recipientId: userInfo.primaryPerson?.id }, { searchQuery: query.value });

    console.log(data);
    setOptions(formatOptions(data));

    //possible problème avec status
  };

  const handleClick = (e) => {
    onClick(e);
    query.reset();
  };

  const formatOptions = (response) => {
    return response.map((e) => ({
      ...e,
      secondary,
      onClick: () => {
        handleClick(e);
        //faire qqch
      },
      key: e.id,
    }));
  };

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
      {query.value.length === 0 ? null : <ConversationList items={options} />}
    </>
  );
}
