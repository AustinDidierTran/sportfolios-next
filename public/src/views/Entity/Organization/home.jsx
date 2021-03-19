import React, { useEffect, useContext } from 'react';

import IgContainer from '../../../components/Custom/IgContainer';
import HeaderHome from '../../../components/Custom/HeaderHome';
import { ENTITIES_ROLE_ENUM, GLOBAL_ENUM } from '../../../../common/enums';
import { formatPageTitle } from '../../../utils/stringFormats';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Store } from '../../../Store';
import Posts from '../../../components/Custom/Posts';

const useStyles = makeStyles(() => ({
  IgContainer: {
    backgroundColor: '#f5f5f5 !important',
  },
}));

export default function OrganizationHome(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos, navBar } = props;

  useEffect(() => {
    document.title = formatPageTitle(basicInfos.name);
  }, []);
  const {
    state: { userInfo },
  } = useContext(Store);

  return (
    <>
      <HeaderHome basicInfos={basicInfos} navTabs={navBar} type={GLOBAL_ENUM.ORGANIZATION} />
      <IgContainer className={classes.IgContainer}>
        <Posts
          userInfo={userInfo}
          allowPostImage
          allowNewPost={basicInfos.role === ENTITIES_ROLE_ENUM.ADMIN}
          entityIdCreatePost={basicInfos.id}
          entityRole={basicInfos.role}
          allowComment
          allowLike
          locationId={basicInfos.id}
          elevation={1}
          placeholder={t('start_a_post')}
        />
      </IgContainer>
    </>
  );
}
