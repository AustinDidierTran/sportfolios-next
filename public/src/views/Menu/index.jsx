import React, { useContext } from 'react';
import styles from './More.module.css';
import { ROUTES } from '../../actions/goTo/index';
import { useTranslation } from 'react-i18next';
import { Store, ACTION_ENUM } from '../../Store';

import Paper from '../../components/Custom/Paper';
import Icon from '../../components/Custom/Icon';
import { formatRoute } from '../../utils/stringFormats';
import { useRouter } from 'next/router';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

export default function Menu() {
  const router = useRouter();
  const { dispatch } = useContext(Store);

  const { t } = useTranslation();

  const logout = () => dispatch({ type: ACTION_ENUM.LOGOUT });

  const data = [
    {
      name: t('create.create_person'),
      route: formatRoute(ROUTES.createPerson),
      icon: 'Person',
    },
    {
      name: t('create.create_event'),
      route: formatRoute(ROUTES.createEvent),
      icon: 'Event',
    },
    {
      name: t('create.create_team'),
      route: formatRoute(ROUTES.createTeam),
      icon: 'Group',
    },
    {
      name: t('create.create_organization'),
      route: formatRoute(ROUTES.createOrganization),
      icon: 'Business',
    },
    {
      name: t('messages'),
      route: formatRoute(ROUTES.conversations),
      icon: 'Chat',
    },
    {
      name: t('cart.title'),
      route: formatRoute(ROUTES.cart),
      icon: 'ShoppingCart',
    },
    {
      name: t('settings'),
      route: ROUTES.userSettings,
      icon: 'Settings',
    },
    {
      name: t('logout'),
      function: logout,
      style: { color: 'red', textAlign: 'center' },
    },
  ];
  return (
    <div className={styles.container}>
      {data.map((d, index) => (
        <Paper
          className={styles.card}
          onClick={
            d.function ||
            (() => {
              router.push(d.route);
            })
          }
          key={index}
        >
          <ListItem className={styles.listItem}>
            {d.icon ? (
              <ListItemIcon>
                <Icon icon={d.icon} className={styles.icon} color="textSecondary" />
              </ListItemIcon>
            ) : (
              <div />
            )}
            <ListItemText className={styles.text} primary={d.name} style={d.style}>
              {d.name}
            </ListItemText>
          </ListItem>
        </Paper>
      ))}
    </div>
  );
}
