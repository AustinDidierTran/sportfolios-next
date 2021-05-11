import React, { useState, useMemo } from 'react';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';

import { useTranslation } from 'react-i18next';
import { formatPrice } from '../../../../utils/stringFormats';
import styles from './MembershipOrganizationItem.module.css';
import CustomCollapse from '../../Collapse';
import CustomIconButton from '../../IconButton';
import CustomButton from '../../Button';

export default function MembershipOrganizationItem(props) {
  const { t } = useTranslation();

  const {
    membership,
    price,
    membershipType,
    expirationDate,
    onDelete,
    onEdit,
    id,
    taxRates,
    transactionFees,
    description,
    fileName,
    fileUrl,
  } = props;
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  const icon = useMemo(() => (expanded ? 'KeyboardArrowUp' : 'KeyboardArrowDown'), [expanded]);

  const total = useMemo(
    () =>
      taxRates.reduce((prev, curr) => {
        return prev + (price * curr.percentage) / 100;
      }, 0) + price,
    [price, taxRates]
  );

  return (
    <>
      <ListItem onClick={handleExpand}>
        <ListItemText primary={`${membership} | ${formatPrice(price)}`} secondary={membershipType}></ListItemText>
        <CustomIconButton onClick={handleExpand} aria-expanded={expanded} icon={icon} style={{ color: 'grey' }} />
      </ListItem>
      <CustomCollapse in={expanded} timeout="auto" unmountOnExit>
        <div style={{ backgroundColor: '#F5F5F5' }}>
          <ListItem>
            <ListItemText primary={membershipType} secondary={`${t('expire_on')} ${expirationDate}`}></ListItemText>
          </ListItem>
          {fileUrl != null && (
            <ListItem className={styles.money}>
              <ListItemText primary={`${t('terms_and_conditions')}:`}></ListItemText>
              <a style={{ color: 'blue' }} href={`${fileUrl}`} target="_blank">{`${fileName}`}</a>
            </ListItem>
          )}
          {description != null && (
            <ListItem className={styles.money}>
              <ListItemText primary={`${t('description.description')}:`}></ListItemText>
              <ListItemText primary={`${description}`}></ListItemText>
            </ListItem>
          )}
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('subtotal')}:`}></ListItemText>
            <ListItemText primary={`${formatPrice(price)}`}></ListItemText>
          </ListItem>
          {taxRates.map((t, index) => (
            <ListItem className={styles.money} key={index}>
              <ListItemText primary={`${t.display_name} (${t.percentage}%)`} secondary={t.description}></ListItemText>
              <ListItemText primary={`${formatPrice((price * t.percentage) / 100)}`}></ListItemText>
            </ListItem>
          ))}
          <Divider />
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('total')}:`} />
            <ListItemText primary={`${formatPrice(total)}`} />
          </ListItem>
          <Divider />
          {total != 0 && (
            <>
              <ListItem className={styles.money}>
                <ListItemText primary={t('payment.transaction_fees')} />
                <ListItemText primary={formatPrice(transactionFees)} />
              </ListItem>
              <ListItem className={styles.money}>
                <ListItemText primary={t('payment.received_amount')} />
                <ListItemText primary={formatPrice(total - transactionFees)} />
              </ListItem>
              <Divider />
            </>
          )}
          <CustomButton
            onClick={() => {
              onDelete(id);
            }}
            endIcon="Delete"
            color="secondary"
            style={{ margin: '8px' }}
          >
            {t('delete.delete')}
          </CustomButton>

          <CustomButton
            onClick={() => {
              onEdit(id, fileName, fileUrl, description);
            }}
            endIcon="Edit"
            color="primary"
            style={{ margin: '8px' }}
          >
            {t('edit.edit_terms_and_conditions')}
          </CustomButton>
        </div>
      </CustomCollapse>
      <Divider />
    </>
  );
}
