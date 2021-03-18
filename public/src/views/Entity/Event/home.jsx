import React, { useEffect, useState, useRef, useContext, componentDidMount } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Store } from '../../../Store';
import Posts from '../../../components/Custom/Posts';

const useStyles = makeStyles((theme) => ({
  IgContainer: {
    backgroundColor: '#f5f5f5 !important',
  },
}));

export default function OrganizationHome(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos, navBar, eventInfo } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, []);
  const {
    state: { userInfo },
  } = useContext(Store);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} eventInfo={eventInfo} navTabs={navBar} type={GLOBAL_ENUM.EVENT} />
      <IgContainer className={classes.IgContainer}>
        <Posts
          userInfo={userInfo}
          allowPostImage={true}
          allowNewPost={true}
          entityIdCreatePost={userInfo?.primaryPerson?.entity_id || -1}
          allowComment={true}
          allowLike={true}
          locationId={basicInfos.id}
          elevation={1}
          placeholder={t('start_a_post')}
        />
      </IgContainer>
    </>
  );
}
