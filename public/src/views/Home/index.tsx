import React from "react";

// @ts-ignore
import styles from "./Home.module.css";

import { Card, IgContainer } from "../../components/Custom";

interface IPost {
  cardType: string;
}

interface IProps {
  posts: Array<IPost>;
  refetch: Function
}

const Home: React.FunctionComponent<IProps> = ({ posts, refetch }) => {
  return (
    <IgContainer>
      <div className={styles.general}>
        {posts.map((e, index) => (
          <Card
            type={e.cardType}
            items={{ ...e, update: refetch }}
            key={index}
          />
        ))}
      </div>
    </IgContainer>
  );
}

export default Home