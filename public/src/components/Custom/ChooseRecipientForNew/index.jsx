//****************TEMPLATE VIEW(tsx)**************************//

import React, { useContext, useState, useCallback, useEffect, useMemo } from 'react';
import List from '../List';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import { Store } from '../../../Store';
import { useTranslation } from 'react-i18next';
import styles from './ChooseRecipientForNew.module.css';
import { ListItemText, Typography } from '@material-ui/core';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { Divider } from '@material-ui/core';
import CustomIcon from '../Icon';

//******import utiles******//

//import Button from '@material-ui/core/Button';
//import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
//import { useFormInput } from '../../hooks/forms';

export default function ChooseRecipientForNew(props) {
  const { t } = useTranslation();
  const {
    state: { userInfo: userInfo },
  } = useContext(Store);
  const { recipient, setRecipient } = props;

  const recipientOptions = useMemo(() => {
    if (!userInfo.persons) {
      return ['a', 'b', 'c'];
    }
    return userInfo.persons;
  }, [userInfo.persons]);

  const handleRecipient = (recipient) => {
    setRecipient(recipient);
  };

  return (
    <div>
      <Typography className={styles.sendAs}>{t('send_as')}</Typography>
      <Accordion className={styles.accordion}>
        <AccordionSummary expandIcon={<CustomIcon icon="ExpandMore" />}>
          <Typography variant="body1" className={styles.name}>
            {`${recipient?.name} ${recipient?.surname}`}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {recipientOptions?.map((r) => (
              <div>
                <Divider />
                <ListItemText
                  primary={`${r.name} ${r.surname}`}
                  className={styles.names}
                  onClick={() => handleRecipient(r)}
                />
              </div>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

//******synthaxe hooks******//
/*useEffect(() => {
return ;
  }, []);
*/

//ou//

/*useEffect(() => {
    updateConversation();
  }, [updateConversation]);
*/

/*const nomDeFonction = useCallback(() => {
    getConversationMessages(convoId).then(({ conversation, messages } = { conversation: null, messages: [] }) => {
      if (!conversation) {
        return;
      }
      setConversation(conversation);
      setMessages(messages.sort((a, b) => (moment(a.sentAt).isBefore(b.sentAt) ? -1 : 1)));
    });
  }, [convoId]);
*/

/*const nomDeVariable = useMemo(()=>{
return;
},[]);
*/

/*const content = useFormInput('');*/

//npm run lint
