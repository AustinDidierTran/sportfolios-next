import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import styles from './MebershipInfoItem.module.css';
import CustomButton from '../../Button';
import { useTranslation } from 'react-i18next';

export default function MembershipDetailItem(props) {
  const { t } = useTranslation();

  const { display, onClick, expirationDate, alreadyMember } = props;

  return (
    <ListItem style={{ width: '100%' }} className={styles.main}>
      <ListItemText primary={display} secondary={expirationDate} />
      <ListItemSecondaryAction>
        <CustomButton onClick={onClick}>{alreadyMember ? t('renew_membership') : t('become_member')}</CustomButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
