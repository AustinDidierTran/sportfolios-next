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
import HelpIcon from '@material-ui/icons/Help';
import Divider from '@material-ui/core/Divider';
import IgContainer from '../../components/Custom/IgContainer';
const Posts = dynamic(() => import('../../components/Custom/Posts'));

const FAQ: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const questions = ['how_to_join_us', 'safe_transactions', 'how_to_become_verified'];

  return (
    <IgContainer>
      <div className={styles.center}>
        <Card className={styles.card}>
          <CardHeader
            title={
              <div className={styles.header}>
                <Typography variant="h4">{t('FAQ.title')}</Typography>
                <HelpIcon fontSize="large" className={styles.help} />
              </div>
            }
          />
          <Divider className={styles.dividerTitle} />
          <CardContent>
            <div>
              <List>
                {questions.map((q, index) => (
                  <>
                    {index > 0 ? <Divider className={styles.questionDivider} /> : null}
                    <ListItemText
                      primary={t(`FAQ.questions.${q}.question`)}
                      secondary={t(`FAQ.questions.${q}.answer`)}
                    />
                  </>
                ))}
              </List>
            </div>
          </CardContent>
        </Card>
      </div>
    </IgContainer>
  );
};
export default FAQ;
