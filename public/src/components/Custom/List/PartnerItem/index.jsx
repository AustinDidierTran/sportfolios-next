import React, { useState, useMemo } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Avatar from '../../Avatar';
import Collapse from '../../Collapse';
import IconButton from '../../IconButton';
import Button from '../../Button';
import Typography from '@material-ui/core/Typography';
import styles from './PartnerItem.module.css';
import Divider from '@material-ui/core/Divider';

import { useTranslation } from 'react-i18next';

export default function PartnerItem(props) {
  const { t } = useTranslation();
  const { photoUrl, name, website, description } = props;
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  return (
    <>
      <ListItem button onClick={handleExpand}>
        <ListItemIcon>
          <Avatar photoUrl={photoUrl}></Avatar>
        </ListItemIcon>
        <ListItemText primary={name} secondary={t('partner')} />
        <IconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: 'grey' }} />
      </ListItem>
      <Collapse in={expanded} timeaout="auto" unmountOnExit>
        <ListItem>
          <ListItemText primary={name} secondary={website} />
        </ListItem>
        <Typography display="block" align="left" className={styles.div}>
          {description}
        </Typography>
        <Button onClick={() => {}} endIcon="Delete" color="secondary" style={{ margin: '8px' }}>
          {t('delete.delete')}
        </Button>
        <Button onClick={() => {}} endIcon="Edit" color="primary" style={{ margin: '8px' }}>
          {t('edit.edit')}
        </Button>
        <Divider variant="middle" />
      </Collapse>
    </>
  );
}
