import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import Divider from '@material-ui/core/Divider';
import IgContainer from '../../components/Custom/IgContainer';
import { useTranslation } from 'react-i18next';
import styles from './Message.module.css';
import React from 'react';

const message: React.FunctionComponent = () => {
  const { t } = useTranslation();
  return (
    <IgContainer>
      <div>
        <Card>
          <CardHeader
            title={
              <Typography variant="h3" className={styles.title}>
                {t('messages')}
              </Typography>
            }
          />
          <CardContent></CardContent>
        </Card>
      </div>
    </IgContainer>
  );
};

export default message;
