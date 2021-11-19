import React, { useEffect, useContext, useMemo } from 'react';

import { formatPageTitle } from '../../utils/stringFormats';
import IgContainer from '../../components/Custom/IgContainer';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import { Store } from '../../Store';
import { useTranslation } from 'react-i18next';

import dynamic from 'next/dynamic';

import { Hub } from '@aws-amplify/core';

const AppLinking = dynamic(() => import('./AppLinking'));
const BasicInfo = dynamic(() => import('./BasicInfo'));
const BottomPageLogo = dynamic(() => import('../../components/Custom/BottomPageLogo'));
const ChangePassword = dynamic(() => import('./ChangePassword'));
const Coupons = dynamic(() => import('./Coupons'));
const CreditCards = dynamic(() => import('./CreditCards'));
const Disconnect = dynamic(() => import('./Disconnect'));
const Email = dynamic(() => import('./Email'));
const MyPersons = dynamic(() => import('./MyPersons'));
const NewsLetterEmail = dynamic(() => import('./Email/NewsLetterEmail'));
const Notifications = dynamic(() => import('./Notifications'));

export default function UserSettings() {
  const { t } = useTranslation();
  const { state } = useContext(Store);
  useEffect(() => {
    document.title = formatPageTitle(t('settings'));
  }, []);

  const isLoggedIn = useMemo(() => Boolean(state.userInfo), [state.userInfo]);

  //Scroll to given section specified with # in the url
  const scroll = () => {
    const hash = window.location.hash.substr(1);
    if (hash) {
      const anchor = document.getElementById(hash);
      setTimeout(() => {
        anchor?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 500);
    }
  };
  useEffect(scroll, []);

  if (!isLoggedIn) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Coupons />
      <BasicInfo />
      <Email />
      <NewsLetterEmail />
      <MyPersons />
      <ChangePassword />
      <AppLinking />
      <CreditCards />
      <div id="notifications">
        <Notifications />
      </div>
      <Disconnect />
      <BottomPageLogo />
    </IgContainer>
  );
}
