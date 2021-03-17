import React from 'react';

import styles from '../LandingPage.module.css';
import page2styles from './Page2.module.css';
import Icon from '../../../components/Custom/Icon';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import makeStyles from '@material-ui/core/styles/makeStyles';

export default function Page2() {
  const { t } = useTranslation();

  return (
    <div className={styles.greenContainer}>
      <div className={page2styles.block}>
        <div className={page2styles.part}>
          <Typography className={styles.text} style={{ margin: '16px' }} variant="h2">
            {t('landingPage.plateform.1')}
          </Typography>
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Business"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.2')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Event"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.3')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Person"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.4')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Create"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.5')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Assignment"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.6')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="PermContactCalendar"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.7')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="EmojiEvents"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.8')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Chat"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.9')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Equalizer"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.plateform.10')}
            />
          </ListItem>
        </div>
        <div className={page2styles.part}>
          <Typography className={styles.text} style={{ margin: '16px' }} variant="h2">
            {t('landingPage.branding.1')}
          </Typography>
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="CameraAlt"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.branding.2')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Videocam"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.branding.3')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="TrendingUp"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.branding.4')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Language"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.branding.5')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="AttachMoney"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.branding.6')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="EmojiObjects"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.branding.7')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="Brush"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.branding.8')}
            />
          </ListItem>
          <Divider />
          <ListItem button>
            <div className={styles.icon}>
              <Icon icon="ThumbUp"></Icon>
            </div>
            <ListItemText
              primaryTypographyProps={{ variant: 'h5', className: styles.text }}
              primary={t('landingPage.branding.9')}
            />
          </ListItem>
        </div>
      </div>
    </div>
  );
}
