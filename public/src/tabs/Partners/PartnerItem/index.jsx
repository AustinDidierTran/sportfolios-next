import React, { useState, useMemo } from 'react';

import styles from './PartnerItem.module.css';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '../../../components/Custom/Button';
import IconButton from '../../../components/Custom/IconButton';
import { useTranslation } from 'react-i18next';
import ListItem from '@material-ui/core/ListItem';
import ButtonBase from '@material-ui/core/ButtonBase';

export default function PartnerItem(props) {
  console.log({ props });
  const { website, name, photoUrl, description } = props;
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const redirect = (website) => {
    window.open(website);
  };

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  return (
    <Paper className={expanded ? styles.partnerExpanded : styles.partner}>
      <div
        className={styles.divImage}
        onClick={() => {
          redirect(website);
        }}
      >
        <img src={photoUrl} className={styles.image} />
      </div>
      <div className={styles.text} onClick={handleExpand}>
        <div className={styles.title}>
          <Typography className={styles.name} variant="h5" align="left">
            {name}
          </Typography>
          <Button
            onClick={() => {
              redirect(website);
            }}
            className={styles.button}
          >
            {t('website')}
          </Button>
        </div>
        <ButtonBase>
          <Typography
            className={expanded ? styles.descriptionExpanded : styles.description}
            variant="body2"
            align="left"
          >
            {description}
          </Typography>
        </ButtonBase>
      </div>
      <div className={styles.iconButton}>
        <IconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: 'grey' }} />
      </div>
    </Paper>
  );
}
