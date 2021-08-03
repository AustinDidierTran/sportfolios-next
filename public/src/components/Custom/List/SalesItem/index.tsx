import React, { useMemo } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { useTranslation } from 'react-i18next';
import styles from './SalesItem.module.css';
import { formatPrice, formatDate } from '../../../../utils/stringFormats';
import moment from 'moment';
import CustomAvatar from '../../Avatar';
import MailToButton from '../../MailToButton';

interface IProps {
  photoUrl: string;
  createdAt: string;
  label: string;
  amount: number;
  metadata: any;
  quantity: number;
  email: string;
}

const SalesItem: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();

  const { photoUrl, createdAt, label, amount, metadata, quantity, email } = props;

  const emails = useMemo((): { email: string }[] => [{ email }], [email]);

  return (
    <ListItem button style={{ width: '100%' }}>
      <div className={styles.div}>
        <ListItemIcon>
          <CustomAvatar photoUrl={photoUrl} variant="square" className={styles.photo} />
        </ListItemIcon>
        <ListItemText
          className={styles.name}
          primary={label}
          secondary={metadata.size ? t('sizes_enum_' + metadata.size.toLowerCase()) : null}
        />
        <ListItemText className={styles.quantity} primary={formatPrice(amount)} secondary={t('qt', { quantity })} />
        {email ? <ListItemText secondary={`${t('by')}: ${email}`} className={styles.email} /> : <></>}

        <MailToButton emails={emails} />
        <ListItemText
          className={styles.date}
          secondary={`${t('purchased_on')}: ${formatDate(moment.utc(createdAt))}`}
        />
      </div>
    </ListItem>
  );
};
export default SalesItem;
