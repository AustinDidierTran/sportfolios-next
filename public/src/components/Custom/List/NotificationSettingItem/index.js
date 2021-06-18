import React, { useContext, useMemo } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Switch from '@material-ui/core/Switch';
import Collapse from '@material-ui/core/Collapse';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NOTIFICATION_MEDIA, NOTIFICATION_TYPE, SEVERITY_ENUM } from '../../../../../common/enums';
import Typography from '@material-ui/core/Typography';

import { Store, ACTION_ENUM } from '../../../../Store';
import CustomIcon from '../../Icon';
import styles from './NotificationSettingsItem.module.css';

const WITH_CHAT_BOT = [NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE, NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST];

const WITH_IN_APP = [
  NOTIFICATION_TYPE.ADDED_TO_EVENT,
  NOTIFICATION_TYPE.ADDED_TO_TEAM,
  NOTIFICATION_TYPE.REQUEST_TO_JOIN_TEAM,
  NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE,
  NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT,
  NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST,
];

const WITHOUT_EMAIL = [
  NOTIFICATION_TYPE.REQUEST_TO_JOIN_TEAM,
  NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE,
  NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT,
  NOTIFICATION_TYPE.SCORE_SUBMISSION_REQUEST,
];

export default function NotificationSettingsItem(props) {
  const { name, email, inApp, chatbot, chatbotDisabled, icon, onChange, description, notificationType } = props;
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };
  const { dispatch } = useContext(Store);

  function onChatbotClick() {
    if (chatbotDisabled) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you.you_need_to_connect_your_messenger_account'),
        severity: SEVERITY_ENUM.INFO,
        duration: 4000,
      });
    }
  }

  const withInApp = useMemo(() => WITH_IN_APP.includes(notificationType), [notificationType]);
  const withChatBot = useMemo(() => WITH_CHAT_BOT.includes(notificationType), [notificationType]);
  const withEmail = useMemo(() => !WITHOUT_EMAIL.includes(notificationType), [notificationType]);

  const emailString = useMemo(() => (withEmail && email ? t('email.email') : ''), [withEmail, email]);
  const chatBotString = useMemo(() => (withChatBot && chatbot ? t('chatbot') : ''), [withChatBot, chatbot]);
  const inAppString = useMemo(() => (withInApp && inApp ? t('in_app') : ''), [withInApp, inApp]);

  return (
    <>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>
          <CustomIcon icon={icon} />
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={
            [emailString, chatBotString, inAppString].filter(Boolean).join(', ') || t('notifications_disabled')
          }
        />
        <CustomIcon icon={open ? 'ExpandLess' : 'ExpandMore'} />
      </ListItem>
      <Collapse in={open} timeaout="auto" unmountOnExit className={styles.collapse}>
        <Typography variant="body2" align="left" style={{ paddingLeft: '20px' }}>
          {description}
        </Typography>
        <List component="div" disablePadding>
          {withEmail ? (
            <ListItem dense style={{ paddingLeft: 30 }}>
              <ListItemIcon>
                <CustomIcon icon="Mail" />
              </ListItemIcon>
              <ListItemText primary={t('email.email')} />
              <Switch
                checked={email}
                color="primary"
                onChange={(e) =>
                  onChange({
                    type: notificationType,
                    media: NOTIFICATION_MEDIA.EMAIL,
                    enabled: e.target.checked,
                  })
                }
              />
            </ListItem>
          ) : null}
          {withInApp ? (
            <ListItem dense style={{ paddingLeft: 30 }}>
              <ListItemIcon>
                <CustomIcon icon="Web" />
              </ListItemIcon>
              <ListItemText primary={t('in_app')} />
              <Switch
                checked={inApp}
                color="primary"
                onChange={(e) =>
                  onChange({
                    type: notificationType,
                    media: NOTIFICATION_MEDIA.IN_APP,
                    enabled: e.target.checked,
                  })
                }
              />
            </ListItem>
          ) : null}
          {withChatBot ? (
            <ListItem dense style={{ paddingLeft: 30 }} onClick={onChatbotClick}>
              <ListItemIcon>
                <CustomIcon icon="Chat" />
              </ListItemIcon>
              <ListItemText primary={t('chatbot')} />
              <Switch
                disabled={chatbotDisabled}
                checked={chatbot}
                color="primary"
                onChange={(e) =>
                  onChange({
                    type: notificationType,
                    media: NOTIFICATION_MEDIA.CHATBOT,
                    enabled: e.target.checked,
                  })
                }
              />
            </ListItem>
          ) : null}
        </List>
      </Collapse>
    </>
  );
}
