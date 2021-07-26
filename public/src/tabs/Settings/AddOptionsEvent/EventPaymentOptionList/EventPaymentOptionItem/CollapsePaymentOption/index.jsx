import React, { useMemo } from 'react';
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
import { goTo, ROUTES } from '../../../../../../actions/goTo';

export default function CollapsePaymentOption(props) {
  const { t } = useTranslation();
  const { option, expanded, setEdit, setAlertDialog } = props;
  const {
    id,
    teamPrice,
    individualPrice,
    startTime,
    endTime,
    owner,
    individualTaxRates,
    teamTaxRates,
    teamActivity,
    teamAcceptation,
    playerAcceptation,
    informations,
    teamTransactionFees,
    individualTransactionFees,
  } = option;

  const teamTotal = useMemo(() => {
    if (!teamPrice) {
      return 0;
    }
    return (
      teamTaxRates.reduce((prev, curr) => {
        return prev + (teamPrice * curr.percentage) / 100;
      }, 0) + teamPrice
    );
  }, [teamPrice, teamTaxRates]);

  const individualTotal = useMemo(() => {
    if (!individualPrice) {
      return 0;
    }
    return (
      individualTaxRates.reduce((prev, curr) => {
        return prev + (individualPrice * curr.percentage) / 100;
      }, 0) + individualPrice
    );
  }, [(individualPrice, individualTaxRates)]);

  const allTaxes = useMemo(() => {
    const all = individualTaxRates.concat(teamTaxRates);
    const res = all.reduce((prev, curr) => {
      if (prev.some((p) => p.id === curr.id)) {
        return prev;
      }
      return [...prev, curr];
    }, []);
    return res;
  }, [individualTaxRates, teamTaxRates]);

  return (
    <CustomCollapse in={expanded} timeout="auto" unmountOnExit>
      <div style={{ backgroundColor: '#F5F5F5' }}>
        <ListItem>
          <ListItemText
            primary={teamActivity ? t('team.team_activity') : t('individual_activity')}
            secondary={t('open_from_to', {
              startDate: formatDate(moment.utc(startTime), 'LLLL'),
              endDate: formatDate(moment.utc(endTime), 'LLLL'),
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
                  InputProps={{ disableUnderline: true, whiteSpace: 'pre-wrap' }}
                  multiline
                  className={styles.textArea}
                  disabled
                  value={informations}
                />
              }
            />
          )}
        </ListItem>
        {(teamPrice > 0 || individualPrice > 0) && (
          <CustomButton
            endIcon="AttachMoney"
            onClick={() => {
              goTo(ROUTES.paymentOptionStats, { id });
            }}
            style={{ margin: '8px' }}
          >
            {t('see_revenue')}
          </CustomButton>
        )}
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
          {allTaxes.map((t, index) => (
            <ListItem className={styles.money} key={index}>
              <ListItemText primary={`${t.displayName} (${t.percentage}%)`} secondary={t.description} />
              {teamTaxRates.some((team) => team.id === t.id) ? (
                <ListItemText primary={`${formatPrice((teamPrice * t.percentage) / 100)}`}></ListItemText>
              ) : (
                <ListItemText primary={`${formatPrice(0)}`}></ListItemText>
              )}
              {individualTaxRates.some((player) => player.id === t.id) ? (
                <ListItemText primary={`${formatPrice((individualPrice * t.percentage) / 100)}`}></ListItemText>
              ) : (
                <ListItemText primary={`${formatPrice(0)}`}></ListItemText>
              )}
            </ListItem>
          ))}
          <Divider />
          <ListItem className={styles.money}>
            <ListItemText primary={`${t('total')}:`} />
            <ListItemText primary={formatPrice(teamTotal)}></ListItemText>
            <ListItemText primary={formatPrice(individualTotal)}></ListItemText>
          </ListItem>
          <Divider />
          {(teamTotal != 0 || individualTotal != 0) && (
            <>
              <ListItem className={styles.money}>
                <ListItemText primary={t('payment.transaction_fees')} />
                <ListItemText primary={formatPrice(teamTransactionFees)}></ListItemText>
                <ListItemText primary={formatPrice(individualTransactionFees)}></ListItemText>
              </ListItem>
              <ListItem className={styles.money}>
                <ListItemText primary={t('payment.received_amount')} />
                <ListItemText primary={formatPrice(teamTotal - teamTransactionFees)}></ListItemText>
                <ListItemText primary={formatPrice(individualTotal - individualTransactionFees)}></ListItemText>
              </ListItem>
              <Divider />
            </>
          )}
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
