import { CircularProgress } from '@material-ui/core';
import { KeyboardArrowLeft } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Notification } from '../../../../../typescript/notifications';
import { getNotifications, seeNotifications } from '../../../actions/service/notifications';
import { Store } from '../../../Store';
import CenteredLoadingSpinner from '../common/CenteredLoadingSpinner';
import MainContainer from '../common/MainLayout/Container';
import MainContent from '../common/MainLayout/Content';
import MainHeader from '../common/MainLayout/Header';
import NotificationCard from './component/Notification';

const Title = styled.h1`
  font-size: 1.75rem;
`;

const NotificationCount = styled.span`
  font-size: 0.875rem;
  color: ${(props) => props.theme.shadesOfGrey.primary};
  margin-left: 4.625rem;
  margin-bottom: 1rem;
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

const NOTIFICATION_PER_PAGE = 10;

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

  const divRef = useRef(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(true);
  const [hasMoreNotifications, setHasMoreNotifications] = useState<boolean>(true);

  const updateNotifications = useCallback(async () => {
    setIsLoadingMore(true);
    const newNotifications = await getNotifications(currentPage, NOTIFICATION_PER_PAGE);

    if (newNotifications.length) {
      console.log({ newNotifications });
      setNotifications((notifications) =>
        [...notifications, ...newNotifications].filter((v, i, a) => a.indexOf(v) === i)
      );
      // setIsLoadingMore(false);
      setIsInitialLoading(false);
    }

    if (newNotifications.length < NOTIFICATION_PER_PAGE) {
      setHasMoreNotifications(false);
    }

    setIsLoadingMore(false);
  }, [currentPage]);

  useEffect(() => {
    updateNotifications();
  }, [updateNotifications]);

  // Do we want to see notifications?
  useEffect(() => {
    seeNotifications();
  }, []);

  useEffect(() => {
    const element = divRef.current;

    if (!element) {
      return;
    }

    const hasOverflowingChildren = element.offsetHeight < element.scrollHeight;

    if (!hasOverflowingChildren) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage]);

  const notificationText = useMemo<string>(() => {
    if (unreadNotificationsCount === 0) {
      return t('notifications.description.no_new_notifications');
    }
    if (unreadNotificationsCount === 1) {
      return t('notifications.description.one_new_notification');
    }
    return t('notifications.description.many_new_notifications', { count: unreadNotificationsCount });
  }, [unreadNotificationsCount]);

  const scrollHandler = useCallback(
    (e) => {
      if (!hasMoreNotifications) {
        return;
      }
      const element = e.target;

      if (element.scrollHeight - Math.ceil(element.scrollTop) <= element.clientHeight) {
        setCurrentPage(currentPage + 1);
      }
    },
    [currentPage, hasMoreNotifications]
  );

  return (
    <MainContainer>
      <MainHeader style={{ padding: '1.5rem 1.5rem 0.5rem 1.5rem', height: '4rem' }}>
        <KeyboardArrowLeft style={{ height: 32, width: 32, cursor: 'pointer' }} onClick={onBack} />
        <Title>{t('notifications.title')}</Title>
      </MainHeader>
      <MainContent onScroll={scrollHandler} ref={divRef}>
        <NotificationCount>{notificationText}</NotificationCount>
        {(() => {
          if (isInitialLoading) {
            return <CenteredLoadingSpinner />;
          }
          return (
            <NotificationContainer>
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
