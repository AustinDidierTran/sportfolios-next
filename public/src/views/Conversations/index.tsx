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
import React, { useEffect, useCallback, useContext, useState } from 'react';
import moment from 'moment';
import { Store } from '../../Store';
import IconButton from '../../components/Custom/IconButton';
import { goTo, ROUTES } from '../../actions/goTo';
import { IConversationPreview } from '../../../../typescript/conversation';
import ConversationSearchList from '../../components/Custom/SearchList/ConversationSearchList';
import { getConversations } from '../../actions/service/messaging';
import ConversationPreview from './ConversationPreview';
import ArrowBackIosRounded from '@material-ui/icons/ArrowBackIosRounded';
const Conversations: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState<IConversationPreview[]>([]);

  const {
    state: { userInfo: userInfo },
  } = useContext(Store);

  // TODO: Call this function on websocket update
  const updateConversations = useCallback(() => {
    getConversations({ recipientId: userInfo.primaryPerson?.id }).then((c) =>
      setConversations(
        c?.sort((a, b) => (moment(b.lastMessage?.sentAt).isBefore(moment(a.lastMessage?.sentAt)) ? -1 : 1))
      )
    );
  }, [userInfo.primaryPerson?.id]);

  useEffect(() => {
    updateConversations();
  }, [updateConversations]);

  const handleArrowBack = () => {
    goTo(ROUTES.home);
  };

  const goToConversation = async (conversation: IConversationPreview) => {
    goTo(ROUTES.conversation, { id: conversation.id });
  };

  return (
    <IgContainer>
      <div className={styles.center}>
        <Card className={styles.card}>
          <CardHeader
            title={
              <div className={styles.header}>
                <ArrowBackIosRounded className={styles.arrow} onClick={handleArrowBack} />
                <Typography className={styles.title} variant="h2">
                  {t('messages')}
                </Typography>
              </div>
            }
            action={
              <IconButton
                onClick={() => {
                  goTo(ROUTES.newMessage);
                }}
                className={styles.create}
                tooltip={t('new_message')}
                icon="Add"
                size="large"
              />
            }
          />
          <CardContent>
            <div className={styles.searchBar}>
              <ConversationSearchList onClick={goToConversation} />
            </div>

            <Divider className={styles.divider} />
            <List>
              {conversations?.map((c) => (
                <>
                  <ConversationPreview conversation={c} userInfo={userInfo} />
                  <Divider className={styles.divider} />
                </>
              ))}
            </List>
          </CardContent>
        </Card>
      </div>
    </IgContainer>
  );
};

export default Conversations;
