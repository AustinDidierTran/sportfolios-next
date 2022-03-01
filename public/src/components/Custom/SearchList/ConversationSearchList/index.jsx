import React, { useEffect, useState, useContext } from 'react';

import { useFormInput } from '../../../../hooks/forms';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useTranslation } from 'react-i18next';
import CustomTextField from '../../TextField';
import CustomIcon from '../../Icon';
import ConversationList from './ConversationList';
import { getConversations } from '../../../../actions/service/messaging';
import { Store } from '../../../../Store';
import styles from './ConversationSearchList.module.css';

export default function ConversationSearchList(props) {
  const { label, onClick, secondary, autoFocus, inputRef } = props;
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

    setOptions(formatOptions(data));

    //possible problème avec status
  };

  const handleClick = (e) => {
    onClick(e);
    query.reset();
  };

  const formatOptions = (response) => {
    if (!response) {
      return;
    }
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

  const onEnter = (e) => {
    if (e.key === 'Enter' && options?.length) {
      onClick(options[0]);
    }
  };
  return (
    <div className={styles.center}>
      <CustomTextField
        {...query.inputProps}
        label={label}
        size="large"
        multiline
        placeholder={t('search.title')}
        rowsMax={Infinity}
        autoFocus={autoFocus}
        onKeyPress={onEnter}
        inputRef={inputRef}
        className={styles.customTextField}
        inputProps={{ className: styles.writing }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <CustomIcon icon="Search" />
            </InputAdornment>
          ),
        }}
      />
      {query.value.length === 0 ? null : <ConversationList onClick={onClick} items={options} />}
    </div>
  );
}
