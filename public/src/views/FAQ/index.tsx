import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import Button from '@material-ui/core/Button';
import styles from './FAQ.module.css';
import { Store } from '../../Store';
import api from '../../actions/api';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ForumIcon from '@material-ui/icons/Forum';
import Divider from '@material-ui/core/Divider';
import Post from '../../components/Custom/Card/Post';
const Posts = dynamic(() => import('../../components/Custom/Posts'));

const FAQ: React.FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.center}>
      <Card className={styles.card}>
        <CardHeader
          title={
            <div className={styles.header}>
              <Typography variant="h4">{t('FAQ')}</Typography>
              <ForumIcon fontSize="large" className={styles.help} />
            </div>
          }
        />
        <Divider className={styles.dividerTitle} />
        <CardContent>
          <div>
            <List>
              <ListItemText primary={t('how_to_join_us')} secondary={t('how_to_join_us_message')} />
              <Divider />
              <ListItemText primary={t('time_before_payment')} secondary={t('time_before_payment_message')} />
            </List>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default FAQ;
