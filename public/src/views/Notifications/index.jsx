import React, { useEffect } from 'react';
import api from '../../actions/api';
import IgContainer from '../../components/Custom/IgContainer';
import styles from './Notifications.module.css';
import dynamic from 'next/dynamic';

const Notifications = dynamic(() => import('../Header/HeaderFlyout/Notifications'));

export default function NotificationsMobile() {
  useEffect(() => {
    api('/api/notifications/see', {
      method: 'PUT',
    });
  }, []);

  return (
    <IgContainer className={styles.mobileContainer}>
      <Notifications isMobileView />
    </IgContainer>
  );
}
