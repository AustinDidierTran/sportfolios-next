import React, { useState, useEffect } from 'react';
import styles from './BasicInfos.module.css';

import { Avatar } from '../../../components/Custom';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

import { useFormInput } from '../../../hooks/forms';

export default function BasicInfos(props) {
  const { name: nameProp, surname, photoUrl: initialPhotoUrl } = props.basicInfos;

  const [photoUrl, setPhotoUrl] = useState(initialPhotoUrl);

  useEffect(() => {
    setPhotoUrl(initialPhotoUrl);
  }, [initialPhotoUrl]);

  const name = useFormInput(nameProp);

  return (
    <Container className={styles.card}>
      <Avatar photoUrl={photoUrl} size="lg" />
      <div className={styles.fullName}>
        <Typography variant="h3" className={styles.text}>
          {`${name.value}${surname ? ' ' + surname : ''}`}
        </Typography>
      </div>
    </Container>
  );
}
