import React, { useCallback, useContext } from 'react';
import { goTo, ROUTES } from '../../../../actions/goTo';
import { ACTION_ENUM, Store } from '../../../../Store';
import Badge from '../../ForYouPage/components/Badge';
import Chat from '@material-ui/icons/Chat';
import { FEATURE_MESSAGES_ENABLED } from '../../../../../../feature-flags';

const MessagingModule: React.FunctionComponent = () => {
  const {
    state: { unreadMessagesCount },
    dispatch,
  } = useContext(Store);

  const onClick = useCallback(() => {
    dispatch({ type: ACTION_ENUM.UPDATE_UNREAD_MESSAGES_COUNT, payload: 0 });

    goTo(ROUTES.conversations);
  }, [dispatch, goTo, ROUTES]);

  if (!FEATURE_MESSAGES_ENABLED) {
    return <></>;
  }

  return (
    <Badge count={unreadMessagesCount} onClick={onClick}>
      <Chat style={{ color: '#707070', height: 32, width: 32 }} height={32} width={32} />
    </Badge>
  );
};

export default MessagingModule;
