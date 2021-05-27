import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import Collapse from '../../../../../components/Custom/Collapse';
import Button from '../../../../../components/Custom/Button';
import { formatDate, formatPrice } from '../../../../../utils/stringFormats';
import MailToButton from '../../../../../components/Custom/MailToButton';
import moment from 'moment';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import styles from './CollapsePlayersRegisteredMobile.module.css';

export default function CollapsePlayersRegisteredMobile(props) {
  const { t } = useTranslation();
  const { expanded, player, unregister } = props;

  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <ListItem>
        <ListItemText className={styles.text} primary={player.email} secondary={t('email.email')}></ListItemText>
        <MailToButton emails={[{ email: player.email }]} color="grey" />
      </ListItem>
      <ListItem>
        {player.option ? (
          <ListItemText
            className={styles.text}
            primary={`${player.option.name} (${
              player.option.individual_price === 0 ? t('free') : formatPrice(player.option.individual_price)
            })`}
            secondary={t('option')}
          ></ListItemText>
        ) : (
          <ListItemText className={styles.text} primary={t('no.no_option')} secondary={t('option')}></ListItemText>
        )}
      </ListItem>
      <ListItem>
        <ListItemText className={styles.text} primary={t('is_member')} />
        {player.isMember ? (
          <Chip label={t('yes')} color="primary" variant="outlined" />
        ) : (
          <Chip label={t('no.no')} color="secondary" variant="outlined" />
        )}
      </ListItem>
      <ListItem>
        {player.informations && (
          <ListItemText
            className={styles.text}
            primary={player?.option?.informations}
            secondary={
              <TextField
                InputProps={{ disableUnderline: true, whiteSpace: 'pre-wrap' }}
                multiline
                className={styles.textArea}
                disabled
                value={player.informations}
              />
            }
          />
        )}
      </ListItem>
      <ListItem>
        <ListItemText
          className={styles.text}
          primary={formatDate(moment(player.registeredOn))}
          secondary={t('register.registration')}
        />
        {player?.invoice?.created_at && (
          <ListItemText
            className={styles.text}
            primary={formatDate(moment(player?.invoice?.created_at))}
            secondary={t('payment.payment')}
          />
        )}
      </ListItem>
      <Button endIcon="MoneyOff" onClick={unregister} color="secondary" style={{ margin: '8px' }}>
        {t('register.unregister')}
      </Button>
    </Collapse>
  );
}
