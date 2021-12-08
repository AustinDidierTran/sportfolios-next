import React, { useContext } from 'react';

import IgContainer from '../../components/Custom/IgContainer';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { Store } from '../../Store';
import dynamic from 'next/dynamic';
import Description from './Description';
import { Entity } from '../../../../typescript/types';

const Posts = dynamic(() => import('../../components/Custom/Posts'));

const useStyles = makeStyles(() => ({
  IgContainer: {
    backgroundColor: '#f5f5f5 !important',
  },
}));

interface IProps {
  basicInfos: Entity;
  isAdmin: boolean;
}

const Home: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { basicInfos, isAdmin } = props;
  const {
    state: { userInfo },
  } = useContext(Store);
  return (
    <IgContainer className={classes.IgContainer}>
      <Description description={basicInfos.description} />
      <Posts
        userInfo={userInfo}
        allowPostImage
        allowNewPost={isAdmin}
        entityIdCreatePost={basicInfos.id}
        allowComment
        allowLike
        locationId={basicInfos.id}
        elevation={1}
        placeholder={t('start_a_post')}
      />
    </IgContainer>
  );
};
export default Home;
