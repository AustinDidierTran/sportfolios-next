import React, { useState } from 'react';

import Card from '@material-ui/core/Card';
import styles from './Post.module.css';

export default function Post(props) {
  const { postInfo } = props;
  return <Card className={styles.card}>{postInfo.content}</Card>;
}
