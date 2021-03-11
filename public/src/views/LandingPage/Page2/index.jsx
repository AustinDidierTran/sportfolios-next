import React from 'react';

import styles from '../LandingPage.module.css';
import page2styles from './Page2.module.css';
import Icon from '../../../components/Custom/Icon';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import Divider from '@material-ui/core/Divider';
import { Card } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '32px',
    marginRight: '32px',
    marginTop: '16px',
    marginBottom: '16px',
    backgroundColor: theme.palette.shadesOfGrey.veryLight,
  },
}));

export default function Page2() {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <div className={styles.greenContainer}>
      <div className={page2styles.block}>
        <Card className={classes.root}>
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
        </Card>
        <Card className={classes.root}>
          <div className={page2styles.part}>
            <Typography className={styles.text} style={{ margin: '16px' }} variant="h2">
              {t('landingPage.branding.1')}
            </Typography>
            <ListItem button>
              <div className={styles.icon}>
                <Typography>-</Typography>
              </div>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                primary={t('landingPage.branding.2')}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <div className={styles.icon}>
                <Typography>-</Typography>
              </div>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                primary={t('landingPage.branding.3')}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <div className={styles.icon}>
                <Typography>-</Typography>
              </div>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                primary={t('landingPage.branding.4')}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <div className={styles.icon}>
                <Typography>-</Typography>
              </div>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                primary={t('landingPage.branding.5')}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <div className={styles.icon}>
                <Typography>-</Typography>
              </div>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                primary={t('landingPage.branding.6')}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <div className={styles.icon}>
                <Typography>-</Typography>
              </div>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                primary={t('landingPage.branding.7')}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <div className={styles.icon}>
                <Typography>-</Typography>
              </div>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                primary={t('landingPage.branding.8')}
              />
            </ListItem>
            <Divider />
            <ListItem button>
              <div className={styles.icon}>
                <Typography>-</Typography>
              </div>
              <ListItemText
                primaryTypographyProps={{ variant: 'h5', className: styles.text }}
                primary={t('landingPage.branding.9')}
              />
            </ListItem>
          </div>
        </Card>
      </div>
    </div>
  );
}
