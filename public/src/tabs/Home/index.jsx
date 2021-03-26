import React, { useContext } from 'react';

import IgContainer from '../../components/Custom/IgContainer';
import { ENTITIES_ROLE_ENUM } from '../../../common/enums';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Store } from '../../Store';
import loadable from '@loadable/component';

const Posts = loadable(() => import('../../components/Custom/Posts'));

const useStyles = makeStyles(() => ({
  IgContainer: {
    backgroundColor: '#f5f5f5 !important',
  },
}));

export default function Home(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos } = props;
  const {
    state: { userInfo },
  } = useContext(Store);

  return (
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
  );
}
