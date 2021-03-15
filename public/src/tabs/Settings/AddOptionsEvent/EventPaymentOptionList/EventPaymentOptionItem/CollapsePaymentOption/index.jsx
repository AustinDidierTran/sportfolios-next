import React from 'react';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import styles from './CollapsePaymentOption.module.css';
import CustomButton from '../../../../../../components/Custom/Button';
import CustomCollapse from '../../../../../../components/Custom/Collapse';
import { formatDate, formatPrice } from '../../../../../../utils/stringFormats';
import TextField from '@material-ui/core/TextField';

export default function CollapsePaymentOption(props) {
  const { t } = useTranslation();
  const {
    teamPrice,
    individualPrice,
    startTime,
    endTime,
    owner,
    taxRates,
    teamActivity,
    expanded,
    setEdit,
    setAlertDialog,
    teamAcceptation,
    playerAcceptation,
    informations,
  } = props;

  return (
    <CustomCollapse in={expanded} timeout="auto" unmountOnExit>
      <div style={{ backgroundColor: '#F5F5F5' }}>
        <ListItem>
          <ListItemText
            primary={teamActivity ? t('team.team_activity') : t('individual_activity')}
            secondary={t('open_from_to', {
              startDate: formatDate(moment(startTime), 'LLLL'),
              endDate: formatDate(moment(endTime), 'LLLL'),
            })}
          />
        </ListItem>
        <ListItem>
          {owner.basicInfos ? (
            <ListItemText primary={owner.basicInfos.name} secondary={t('payment.payment_option_owner')} />
          ) : (
            <ListItemText
              primary={t('payment.no_owner_free_payment_option')}
              secondary={t('payment.payment_option_owner')}
            />
          )}
        </ListItem>
        <ListItem>
          {informations && (
            <ListItemText
              className={styles.text}
              primary={t('required_informations')}
              secondary={
                <TextField
                  InputProps={{ disableUnderline: true }}
                  multiline
                  className={styles.textArea}
                  disabled
                  value={informations}
                />
              }
            />
          )}
        </ListItem>
        <ListItem className={styles.money}>
          <ListItemText />
          <ListItemText primary={t('team.team')} />
          <ListItemText primary={t('player')} />
        </ListItem>
        <Divider />
        <ListItem className={styles.money}>
          <ListItemText primary={t('manual_acceptation')} />
          <ListItemText primary={teamAcceptation ? t('yes') : t('no.no')} />
          <ListItemText primary={playerAcceptation ? t('yes') : t('no.no')} />
        </ListItem>
        <Divider />
        <>
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('subtotal')}:`} />
            <ListItemText primary={`${formatPrice(teamPrice)}`} secondary={t('price_team')}></ListItemText>
            <ListItemText primary={`${formatPrice(individualPrice)}`} secondary={t('price_individual')}></ListItemText>
          </ListItem>
          {taxRates.map((t, index) => (
            <ListItem className={styles.money} key={index}>
              <ListItemText primary={`${t.display_name} (${t.percentage}%)`} secondary={t.description} />
              <ListItemText primary={`${formatPrice((teamPrice * t.percentage) / 100)}`}></ListItemText>
              <ListItemText primary={`${formatPrice((individualPrice * t.percentage) / 100)}`}></ListItemText>
            </ListItem>
          ))}
          <Divider />
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('total')}:`} />
            <ListItemText
              primary={`${formatPrice(
                taxRates.reduce((prev, curr) => {
                  return prev + (teamPrice * curr.percentage) / 100;
                }, 0) + teamPrice
              )}`}
            ></ListItemText>
            <ListItemText
              primary={`${formatPrice(
                taxRates.reduce((prev, curr) => {
                  return prev + (individualPrice * curr.percentage) / 100;
                }, 0) + individualPrice
              )}`}
            ></ListItemText>
          </ListItem>
          <Divider />
        </>
        <CustomButton
          endIcon="Edit"
          onClick={() => {
            setEdit(true);
          }}
          style={{ margin: '8px' }}
        >
          {t('edit.edit')}
        </CustomButton>
        <CustomButton endIcon="Delete" onClick={() => setAlertDialog(true)} color="secondary" style={{ margin: '8px' }}>
          {t('delete.delete')}
        </CustomButton>
      </div>
    </CustomCollapse>
  );
}
