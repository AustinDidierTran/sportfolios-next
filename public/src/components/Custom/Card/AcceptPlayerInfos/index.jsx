import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './AcceptPlayerInfos.module.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '../../Avatar';
import StatusChip from './StatusChip';
import { formatPrice, formatDate } from '../../../../utils/stringFormats';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import moment from 'moment';

export default function AcceptPlayerInfos(props) {
  const { registrationStatus, name, surname, photoUrl, birthDate, gender, fullAddress, player, paymentOption } = props;
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        avatar={<Avatar aria-label="recipe" photoUrl={photoUrl}></Avatar>}
        title={
          <div className={styles.title}>
            <Typography variant="h5">{`${name} ${surname}`}</Typography>
            <div className={styles.chip}>
              <StatusChip registrationStatus={registrationStatus} />
            </div>
          </div>
        }
      />
      <CardContent>
        {paymentOption.informations && (
          <div className={styles.div}>
            <Typography color="textSecondary">{paymentOption.informations}:</Typography>
            <TextField
              InputProps={{ disableUnderline: true, whiteSpace: 'pre-wrap', style: { color: 'black' } }}
              multiline
              className={styles.textArea}
              disabled
              value={player.informations}
            />
          </div>
        )}
        <Divider />
        <div className={styles.div}>
          <Typography color="textSecondary">{`${t('payment.payment_option')}:`}</Typography>
          <Typography>{paymentOption?.name || t('missing_info')}</Typography>
        </div>
        <Divider />
        <div className={styles.div}>
          <Typography color="textSecondary">{`${t('price')}:`}</Typography>
          <Typography>{`${formatPrice(paymentOption?.individual_price)}` || t('missing_info')}</Typography>
        </div>
        <Divider />
        <div className={styles.div}>
          <Typography color="textSecondary">{t('register.registered_on')}:</Typography>
          <Typography>{formatDate(moment(player.created_at)) || t('missing_info')}</Typography>
        </div>
        <Divider />
        <div className={styles.div}>
          <Typography color="textSecondary">{t('birth_date')}:</Typography>
          <Typography>{formatDate(moment(birthDate)) || t('missing_info')}</Typography>
        </div>
        <Divider />
        <div className={styles.div}>
          <Typography color="textSecondary">{t('gender')}:</Typography>
          <Typography>{t(gender) || t('missing_info')}</Typography>
        </div>
        <Divider />
        <div className={styles.div}>
          <Typography color="textSecondary">{t('city')}:</Typography>
          <Typography>{fullAddress?.city || t('missing_info')}</Typography>
        </div>
        <Divider />
        <div className={styles.div}>
          <Typography color="textSecondary">{t('postal_code')}:</Typography>
          <Typography>{fullAddress?.zip || t('missing_info')}</Typography>
        </div>
      </CardContent>
    </Card>
  );
}
