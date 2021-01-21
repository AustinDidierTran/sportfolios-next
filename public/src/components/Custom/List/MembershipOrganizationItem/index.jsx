import React, { useState, useMemo } from 'react';
import { Divider, ListItem, ListItemText } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../../utils/stringFormats';
import styles from './MembershipOrganizationItem.module.css';
import CustomTypography from '../../Collapse';
import CustomIconButton from '../../IconButton';
import CustomButton from '../../Button';

export default function MembershipOrganizationItem(props) {
  const { t } = useTranslation();

  const { membership, price, membershipType, expirationDate, onDelete, id, taxRates } = props;
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  return (
    <>
      <ListItem onClick={handleExpand}>
        <ListItemText primary={`${membership} | ${formatPrice(price)}`} secondary={membershipType}></ListItemText>
        <CustomIconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: 'grey' }} />
      </ListItem>
      <CustomTypography in={expanded} timeout="auto" unmountOnExit>
        <div style={{ backgroundColor: '#F5F5F5' }}>
          <ListItem>
            <ListItemText primary={membershipType} secondary={`${t('expire_on')} ${expirationDate}`}></ListItemText>
          </ListItem>
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('subtotal')}:`}></ListItemText>
            <ListItemText primary={`${formatPrice(price)}`}></ListItemText>
          </ListItem>
          {taxRates.map((t) => (
            <ListItem className={styles.money}>
              <ListItemText primary={`${t.display_name} (${t.percentage}%)`} secondary={t.description}></ListItemText>
              <ListItemText primary={`${formatPrice((price * t.percentage) / 100)}`}></ListItemText>
            </ListItem>
          ))}
          <Divider />
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('total')}:`} />
            <ListItemText
              primary={`${formatPrice(
                taxRates.reduce((prev, curr) => {
                  return prev + (price * curr.percentage) / 100;
                }, 0) + price
              )}`}
            />
          </ListItem>
          <Divider />
          <CustomButton
            onClick={() => {
              onDelete(id);
            }}
            endIcon="Delete"
            color="secondary"
            style={{ margin: '8px' }}
          >
            {t('delete')}
          </CustomButton>
        </div>
      </CustomTypography>
      <Divider />
    </>
  );
}
