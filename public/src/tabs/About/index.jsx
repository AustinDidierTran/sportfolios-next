import React from 'react';
import MyGames from '../../components/Custom/MyGames';
import Paper from '../../components/Custom/Paper';
import styles from './About.module.css';
import { GLOBAL_ENUM } from '../../../common/enums';
import dynamic from 'next/dynamic';

const BasicInfos = dynamic(() => import('./BasicInfos'));

export default function TabAbout(props) {
  const { basicInfos, gamesInfos } = props;

  const { type } = basicInfos;

  switch (type) {
    case GLOBAL_ENUM.PERSON:
      return (
        <>
          <Paper className={styles.card}>
            <BasicInfos basicInfos={basicInfos} />
          </Paper>
          <MyGames gamesInfos={gamesInfos} />
        </>
      );
    default:
      throw 'type not defined';
  }
}
