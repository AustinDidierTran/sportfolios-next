import { CircularProgress } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Notification } from '../../../../../typescript/notifications';
import { getNotifications } from '../../../actions/service/notifications';
import { Store } from '../../../Store';
import CenteredLoadingSpinner from '../common/CenteredLoadingSpinner';
import MainContainer from '../common/MainLayout/Container';
import MainContent from '../common/MainLayout/Content';
import MainHeader from '../common/MainLayout/Header';
import NotificationCard from './component/Notification';

interface Props {
  label: string;
}

const Title = styled.h1`
  font-size: 1.75rem;
`;

const NotificationCount = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.shadesOfGrey.primary};
  margin-left: 4.625rem;
`;

const NotificationContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingMoreDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
`;

const NotificationsView: React.FunctionComponent = () => {
  const {
    state: { unreadNotificationsCount },
  } = useContext(Store);
  const { t } = useTranslation();
  const router = useRouter();
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const onBack = useCallback(() => {
    router.back();
  }, []);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(true);
  const [hasMoreNotifications, setHasMoreNotifications] = useState<boolean>(true);

  const updateNotifications = useCallback(async () => {
    setIsLoadingMore(true);
    const newNotifications = await getNotifications(currentPage, 10);

    if (newNotifications.length) {
      setNotifications((notifications) => [...notifications, ...newNotifications]);
      // setIsLoadingMore(false);
      setIsInitialLoading(false);
    } else {
      setHasMoreNotifications(false);
    }
  }, [currentPage]);

  useEffect(() => {
    updateNotifications();
  }, [updateNotifications]);

  // Do we want to see notifications?
  // useEffect(() => {
  //   api('/api/notifications/see', {
  //     method: 'PUT',
  //   });
  // }, []);

  const notificationText = useMemo<string>(() => {
    if (unreadNotificationsCount === 0) {
      return t('notifications.description.no_new_notifications');
    }
    if (unreadNotificationsCount === 1) {
      return t('notifications.description.one_new_notification');
    }
    return t('notifications.description.many_new_notifications', { count: unreadNotificationsCount });
  }, [unreadNotificationsCount]);

  console.log({ notifications });

  return (
    <MainContainer>
      <MainHeader style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', height: '4rem' }}>
        <KeyboardArrowLeft style={{ height: 32, width: 32, cursor: 'pointer' }} onClick={onBack} />
        <Title>{t('notifications.title')}</Title>
      </MainHeader>
      <MainContent>
        {(() => {
          if (isInitialLoading) {
            return <CenteredLoadingSpinner />;
          }
          return (
            <NotificationContainer>
              <NotificationCount>{notificationText}</NotificationCount>

              {/* All notifications here */}
              {notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}

              {isLoadingMore ? (
                <LoadingMoreDiv>
                  <CircularProgress />
                </LoadingMoreDiv>
              ) : (
                <></>
              )}
            </NotificationContainer>
          );
        })()}
      </MainContent>
    </MainContainer>
  );
};

export default NotificationsView;
