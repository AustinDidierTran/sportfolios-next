import React from 'react';

import styles from '../LandingPage.module.css';
import page2styles from './Page2.module.css';
import Icon from '../../../components/Custom/Icon';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';

export default function Page2() {
  const { t } = useTranslation();

  const plateform = [
    { text: t('landingPage.plateform.2'), icon: 'Business' },
    { text: t('landingPage.plateform.3'), icon: 'Event' },
    { text: t('landingPage.plateform.4'), icon: 'Person' },
    { text: t('landingPage.plateform.5'), icon: 'Create' },
    { text: t('landingPage.plateform.6'), icon: 'Assignment' },
    { text: t('landingPage.plateform.7'), icon: 'PermContactCalendar' },
    { text: t('landingPage.plateform.8'), icon: 'EmojiEvents' },
    { text: t('landingPage.plateform.9'), icon: 'Chat' },
    { text: t('landingPage.plateform.10'), icon: 'Equalizer', withoutDivider: true },
  ];
  const branding = [
    { text: t('landingPage.branding.2'), icon: 'CameraAlt' },
    { text: t('landingPage.branding.3'), icon: 'Videocam' },
    { text: t('landingPage.branding.4'), icon: 'TrendingUp' },
    { text: t('landingPage.branding.5'), icon: 'Language' },
    { text: t('landingPage.branding.6'), icon: 'AttachMoney' },
    { text: t('landingPage.branding.7'), icon: 'EmojiObjects' },
    { text: t('landingPage.branding.8'), icon: 'Brush' },
    { text: t('landingPage.branding.9'), icon: 'ThumbUp', withoutDivider: true },
  ];

  return (
    <div className={styles.greenContainer}>
      <div className={page2styles.block}>
        <div className={page2styles.part}>
          <Typography className={styles.text} style={{ margin: '16px' }} variant="h2">
            {t('landingPage.plateform.1')}
          </Typography>
          {plateform.map((p, index) => (
            <div key={index}>
              <ListItem>
                <div className={styles.icon}>
                  <Icon icon={p.icon}></Icon>
                </div>
                <ListItemText primaryTypographyProps={{ variant: 'h5', className: styles.text }} primary={p.text} />
              </ListItem>
              {p.withoutDivider ? <></> : <Divider />}
            </div>
          ))}
        </div>
        <div className={page2styles.part}>
          <Typography className={styles.text} style={{ margin: '16px' }} variant="h2">
            {t('landingPage.branding.1')}
          </Typography>
          {branding.map((b, index) => (
            <div key={index}>
              <ListItem>
                <div className={styles.icon}>
                  <Icon icon={b.icon}></Icon>
                </div>
                <ListItemText primaryTypographyProps={{ variant: 'h5', className: styles.text }} primary={b.text} />
              </ListItem>
              {b.withoutDivider ? <></> : <Divider />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
