import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IgContainer from '../../components/Custom/IgContainer';
import { useTranslation } from 'react-i18next';
import styles from './Conversations.module.css';
import React, { useEffect, useCallback, useContext, useState, useMemo } from 'react';
import moment from 'moment';
import { Store } from '../../Store';
import IconButton from '../../components/Custom/IconButton';
import { goTo, ROUTES } from '../../actions/goTo';
import { IConversationPreview, IConversationMessage, Recipient } from '../../../../typescript/conversation';
import { SOCKET_EVENT } from '../../../common/enums';
import { getConversations, getAllOwnedEntitiesMessaging } from '../../actions/service/messaging';
import ConversationPreview from './ConversationPreview';
import ChooseRecipient from '../../components/Custom/ChooseRecipient';
import { Person } from '../../../../typescript/entity';
import CustomAvatar from '../../components/Custom/Avatar';

interface IProps {
  recipientId: string;
}

const Conversations: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { recipientId } = props;
  const {
    state: { userInfo: userInfo, socket },
  } = useContext(Store);
  const [conversations, setConversations] = useState<IConversationPreview[]>([]);
  const [recipientOptions, setRecipientOptions] = useState<Recipient[]>([]);

  const updateConversations = useCallback(() => {
    getConversations({ recipientId: recipientId }).then((newConversations: IConversationPreview[]) => {
      if (!newConversations) {
        return;
      }
      setConversations(newConversations);
      getAllOwnedEntitiesMessaging().then((recipients: Recipient[]) => {
        if (!recipients) {
          return;
        }
        setRecipientOptions(recipients);
      });
    });
  }, [recipientId]);

  const recipient = useMemo<Recipient>(() => {
    if (recipientOptions.length === 0) {
      return;
    }
    return recipientOptions.find((r: Recipient) => r.id === recipientId);
  }, [recipientOptions, recipientId]);

  useEffect(() => {
    updateConversations();
  }, [updateConversations]);

  useEffect(() => {
    socket.on(SOCKET_EVENT.MESSAGES, (message: IConversationMessage) => {
      if (!message) {
        return;
      }
      setConversations((oldConversations) => {
        const conversationsCopy: IConversationPreview[] = [...oldConversations];
        const conversationIds = conversationsCopy?.map((c) => c.id);
        const index = conversationIds.indexOf(message.conversationId);
        if (!conversationsCopy) {
          return;
        }
        if (index === -1) {
          return;
        }
        conversationsCopy[index].lastMessage = message;

        return conversationsCopy;
      });
    });
    return () => {
      socket.off(SOCKET_EVENT.MESSAGES);
    };
  }, [conversations]);

  const orderedConversations = useMemo(
    () =>
      conversations.sort((a, b) => {
        if (!b.lastMessage) {
          return -1;
        }
        if (!a.lastMessage) {
          return 1;
        }
        return moment(b.lastMessage.sentAt).isBefore(moment(a.lastMessage.sentAt)) ? -1 : 1;
      }),
    [conversations]
  );
  //Change Person
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleChangePerson = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    //Change Person
  };

  return (
    <IgContainer>
      <div className={styles.center}>
        <Card className={styles.card}>
          <CardHeader
            title={
              <div className={styles.header}>
                <Typography className={styles.title} variant="h3">
                  {t('messages')}
                </Typography>
              </div>
            }
            action={
              <div className={styles.options}>
                <div onClick={handleChangePerson}>
                  <CustomAvatar photoUrl={recipient?.photoUrl} className={styles.recipient} />
                </div>
                <IconButton
                  onClick={() => {
                    goTo(ROUTES.newMessage, null, { recipientId: recipientId });
                  }}
                  className={styles.create}
                  tooltip={t('new_message')}
                  icon="Add"
                  size="large"
                />
              </div>
            }
          />
          <CardContent>
            <Divider className={styles.divider} />
            <List>
              {orderedConversations.map((c) => (
                <>
                  <ConversationPreview conversation={c} recipientId={recipientId} />
                  <Divider className={styles.divider} />
                </>
              ))}
            </List>
          </CardContent>
        </Card>
      </div>
      <ChooseRecipient
        anchorEl={anchorEl}
        open={open}
        handleClose={handleClose}
        recipientOptions={recipientOptions}
        updateConversations={updateConversations}
      />
    </IgContainer>
  );
};

export default Conversations;
