import React, { useMemo } from 'react';
import { IConversationPreview } from '../../../../../typescript/conversation';
import SeenConversation from './SeenConversation';
import UnSeenConversation from './UnSeenConversation';

interface IProps {
  conversation: IConversationPreview;
  recipientId: string;
}

const ConversationPreview: React.FunctionComponent<IProps> = (props) => {
  const { conversation, recipientId } = props;

  const seen = useMemo<boolean>(() => {
    const index = conversation.participants.map((p) => p.id).indexOf(recipientId);
    if (index === -1) {
      return;
    }
    if (!conversation.participants[index].readLastMessageAt) {
      return false;
    }
    return true;
    //const rand = Boolean(Math.round(Math.random()));
    //return rand;
  }, [conversation.participants]);

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
