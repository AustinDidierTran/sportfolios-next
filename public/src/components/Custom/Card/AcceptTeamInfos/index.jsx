import React from 'react';

import { useTranslation } from 'react-i18next';
import styles from './AcceptTeamInfos.module.css';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Avatar from '../../Avatar';
import Players from '../../../../tabs/Rosters/RosterCard/Players';
import { formatPrice } from '../../../../../common/utils/stringFormat';

export default function AcceptTeamInfos(props) {
  const { id, name, photoUrl, roster, team, paymentOption } = props;
  const { t } = useTranslation();
  return (
    <Card className={styles.card}>
      <CardHeader
        className={styles.header}
        avatar={<Avatar aria-label="recipe" photoUrl={photoUrl}></Avatar>}
        title={name}
        titleTypographyProps={{ variant: 'h5' }}
      />
      <CardContent>
        <div className={styles.div}>
          <Typography color="textSecondary">{`${t('payment_option')}:`}</Typography>
          <Typography>{paymentOption?.name || t('missing_info')}</Typography>
        </div>
        <div className={styles.div}>
          <Typography color="textSecondary">{`${t('price')}:`}</Typography>
          <Typography>{`${formatPrice(paymentOption?.team_price)}$` || t('missing_info')}</Typography>
        </div>
        <div style={{ marginTop: '16px' }}>
          <Players
            className={styles.players}
            withPlayersInfos={true}
            editableRoster={false}
            editableRole={false}
            players={roster}
            rosterId={id}
            withMyPersonsQuickAdd={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}
