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
    const index = conversation.participants.map((p) => p.id).indexOf(recipientId);
    console.log('indexPreview(participants)', index);
    if (index === -1) {
      console.log('herePreview');
      return;
    }
    if (!conversation.participants[index].readLastMessageAt) {
      console.log('unseen');
      return false;
    }
    console.log('seen');
    return true;
    //const rand = Boolean(Math.round(Math.random()));
    //return rand;
  }, [conversation]);

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
