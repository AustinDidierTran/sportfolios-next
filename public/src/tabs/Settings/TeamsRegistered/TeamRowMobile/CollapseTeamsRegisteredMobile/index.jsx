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
import styles from './CollapseTeamsRegisteredMobile.module.css';

export default function CollapseTeamsRegisteredMobile(props) {
  const { t } = useTranslation();
  const { expanded, team, unregister } = props;

  return (
    <Collapse in={expanded} timeout="auto" unmountOnExit>
      <ListItem>
        <ListItemText
          className={styles.text}
          primary={`${team.captains[0].name} 
          ${team.captains[0].surname}`}
          secondary={t('captain')}
        />
      </ListItem>
      <ListItem>
        <ListItemText className={styles.text} primary={team.email} secondary={t('email.email')}></ListItemText>
        <MailToButton emails={[{ email: team.email }]} color="grey" />
      </ListItem>
      <ListItem>
        {team.option ? (
          <ListItemText
            className={styles.text}
            primary={`${team.option.name} (${
              team.option.team_price === 0 ? t('free') : formatPrice(team.option.team_price)
            })`}
            secondary={t('option')}
          />
        ) : (
          <ListItemText className={styles.text} primary={t('no.no_option')} secondary={t('option')} />
        )}
      </ListItem>
      <ListItem>
        {team.informations && (
          <ListItemText
            className={styles.text}
            primary={team?.option?.informations}
            secondary={
              <TextField
                InputProps={{ disableUnderline: true, whiteSpace: 'pre-wrap' }}
                multiline
                className={styles.textArea}
                disabled
                value={team.informations}
              />
            }
          />
        )}
      </ListItem>
      <ListItem>
        <ListItemText className={styles.text} primary={t('is_member')} />
        {team.isMember ? (
          <Chip label={t('yes')} color="primary" variant="outlined" />
        ) : (
          <Chip label={t('no.no')} color="secondary" variant="outlined" />
        )}
      </ListItem>
      <ListItem>
        <ListItemText
          className={styles.text}
          primary={formatDate(moment(team.registeredOn))}
          secondary={t('register.registration')}
        />
        {team?.invoice?.created_at && (
          <ListItemText
            className={styles.text}
            primary={formatDate(moment(team?.invoice?.created_at))}
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
