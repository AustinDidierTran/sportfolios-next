import React from 'react';

// @ts-ignore
import styles from './Home.module.css';

import IgContainer from '../../components/Custom/IgContainer';
import Card from '../../components/Custom/Card';
import { ForYouPagePost } from '../../../../typescript/types';

interface IProps {
  posts: ForYouPagePost[];
}

const Home: React.FunctionComponent<IProps> = (props: IProps) => {
  const { posts = [] } = props;
  return (
    <IgContainer>
      <div className={styles.general}>
        {posts.map((e, index) => (
          <Card type={e.cardType} items={{ ...e }} key={index} />
        ))}
      </div>
    </IgContainer>
  );
};

export default Home;
