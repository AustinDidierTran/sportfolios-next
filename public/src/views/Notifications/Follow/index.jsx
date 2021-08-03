import React, { useState } from 'react';

import styles from './Follow.module.css';
import Paper from '../../../components/Custom/Paper';
import Avatar from '../../../components/Custom/Avatar';
import { useTranslation } from 'react-i18next';
import history from '../../../stores/history';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default function Follow(props) {
  const { t } = useTranslation();
  const { first_name, last_name, follower, photoUrl } = props;
  const [buttonState, setButtonState] = useState(true);

  const onFollow = () => {
    setButtonState(!buttonState);
  };

  return (
    <Paper className={styles.follow}>
      <div className={styles.information} onClick={() => history.push(`/profile/${follower}`)}>
        <Avatar photoUrl={photoUrl} className={styles.avatar} />
        <Typography>
          <b>{`${first_name} ${last_name}`}</b>
          {t('follow_notification_text')}
        </Typography>
      </div>
      <Button color="primary" className={buttonState ? styles.button : styles.buttonpressed} onClick={onFollow}>
        {buttonState ? t('follow') : t('following')}
      </Button>
    </Paper>
  );
}
