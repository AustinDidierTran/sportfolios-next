import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import CustomButton from '../../Button';
import { useTranslation } from 'react-i18next';
import { APP_ENUM } from '../../../../../common/enums';
import styles from './AppItem.module.css';

const images = {
  [APP_ENUM.FACEBOOK]:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20201015-swk3f-03819b6b-b74e-4cb8-9a1a-299a9ee3b2fc',
  [APP_ENUM.MESSENGER]:
    'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20201016-9hha3-03819b6b-b74e-4cb8-9a1a-299a9ee3b2fc',
};

const defaultImage =
  'https://sportfolios-images.s3.amazonaws.com/development/images/entity/20201016-3gcer-03819b6b-b74e-4cb8-9a1a-299a9ee3b2fc';

export default function AppItem(props) {
  const { t } = useTranslation();
  const { onConnect, onDisconnect, app, description, isConnected, secondaryActions, disabled } = props;
  const imageSrc = images[app] || defaultImage;
  const actions = secondaryActions ? (
    secondaryActions
  ) : (
    <CustomButton
      className={styles.button}
      onClick={isConnected ? onDisconnect : onConnect}
      variant="outlined"
      color={isConnected ? 'secondary' : 'primary'}
      disabled={disabled}
    >
      {isConnected ? t('disconnect') : t('connect')}
    </CustomButton>
  );

  return (
    <ListItem className={styles.main}>
      <ListItemIcon>
        <img src={imageSrc} height="40px" />
      </ListItemIcon>
      <ListItemText className={styles.text} primary={app + ' (Beta)'} secondary={description} />
      <ListItemSecondaryAction>
        <>{actions}</>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
