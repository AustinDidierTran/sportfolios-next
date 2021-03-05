import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './AcceptTeamInfos.module.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '../../Avatar';
import Players from './Players';
import { formatPrice } from '../../../../../common/utils/stringFormat';
import StatusChip from './StatusChip';
import TextField from '@material-ui/core/TextField';

export default function AcceptTeamInfos(props) {
  const { name, photoUrl, roster, paymentOption, registrationStatus, team } = props;

  const { t } = useTranslation();
  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        avatar={<Avatar aria-label="recipe" photoUrl={photoUrl}></Avatar>}
        title={
          <div className={styles.title}>
            <Typography variant="h5">{name}</Typography>
            <div className={styles.chip}>
              <StatusChip registrationStatus={registrationStatus} />
            </div>
          </div>
        }
      />
      <CardContent>
        {paymentOption?.informations && (
          <div className={styles.div}>
            <TextField
              InputProps={{ disableUnderline: true }}
              multiline
              className={styles.textArea}
              disabled
              value={`${paymentOption.informations}:`}
            />
            <TextField
              InputProps={{ disableUnderline: true, style: { color: 'black' } }}
              multiline
              className={styles.textArea}
              disabled
              value={team.informations}
            />
          </div>
        )}
        <div className={styles.div}>
          <Typography color="textSecondary">{`${t('payment.payment_option')}:`}</Typography>
          <Typography>{paymentOption?.name || t('missing_info')}</Typography>
        </div>
        <div className={styles.div}>
          <Typography color="textSecondary">{`${t('price')}:`}</Typography>
          <Typography>{`${formatPrice(paymentOption?.team_price)}$` || t('missing_info')}</Typography>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Players className={styles.players} players={roster} />
        </div>
      </CardContent>
    </Card>
  );
}
