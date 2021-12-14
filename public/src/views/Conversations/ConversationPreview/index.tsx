import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IConversationPreview, Recipient } from '../../../../../typescript/conversation';
import moment from 'moment';
import SeenConversation from './SeenConversation';
import UnSeenConversation from './UnSeenConversation';

interface IProps {
  conversation: IConversationPreview;
  recipientId: string;
}

const ConversationPreview: React.FunctionComponent<IProps> = (props) => {
  const { conversation, recipientId } = props;
  const { t } = useTranslation();

  const seen = useMemo<Boolean>(() => {
    const rand = Boolean(Math.round(Math.random()));
    return rand;
  }, []);

  return (
    <>
      {seen ? (
        <SeenConversation recipientId={recipientId} conversation={conversation} />
      ) : (
        <UnSeenConversation recipientId={recipientId} conversation={conversation} />
      )}
    </>
  );
};
export default ConversationPreview;
