import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { formatRoute } from '../../utils/stringFormats';

import Paper from '../../components/Custom/Paper';
import Button from '../../components/Custom/Button';
import IgContainer from '../../components/Custom/IgContainer';
import { useFormik } from 'formik';

import styles from './OptionPayment.module.css';

import Typography from '@material-ui/core/Typography';
import { FIELD_GROUP_ENUM, SEVERITY_ENUM, EVENT_TYPE, REQUEST_STATUS_ENUM, TABS_ENUM } from '../../../common/enums';
import { goBack, goTo, ROUTES } from '../../actions/goTo';
import AddTeamFeeDialog from '../../components/Custom/FormDialog/AddTeamFee';
import AddPlayerFeeDialog from '../../components/Custom/FormDialog/AddPlayerFee';
import { ACTION_ENUM, Store } from '../../Store';
import api from '../../actions/api';
import { useFields } from '../../hooks/fields';
import moment from 'moment';
import * as yup from 'yup';
import { ERROR_ENUM } from '../../../common/errors';
import { DialogContent } from '@material-ui/core';
import ComponentFactory from '../../components/Custom/ComponentFactory';

export default function OptionPayment() {
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: eventId },
  } = useContext(Store);

  const [ownersId, setOwnersId] = useState([]);
  const [playerPriceTotal, setPlayerPriceTotal] = useState(undefined);
  const [teamPriceTotal, setTeamPriceTotal] = useState(undefined);
  const [openPlayer, setOpenPlayer] = useState(false);
  const [openTeam, setOpenTeam] = useState(false);
  const [edit, setEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventId) {
      getAccounts();
      getEventType();
    }
  }, [eventId]);

  const addOptionToEvent = async (values) => {
    const {
      name,
      eventType,
      teamPrice,
      teamTaxes,
      playerPrice,
      playerTaxes,
      manualAcceptation,
      ownerId,
      openDate,
      openTime,
      closeDate,
      closeTime,
      informations,
    } = values;

    const formattedTeamPrice = Math.floor(Number(teamPrice) * 100);
    const formattedPlayerPrice = Math.floor(Number(playerPrice) * 100);
    const start = new Date(`${openDate} ${openTime}`).getTime();
    const end = new Date(`${closeDate} ${closeTime}`).getTime();

    let infos = informations;
    if (!informations.length) {
      infos = null;
    }

    const res = await api(`/api/entity/option`, {
      method: 'POST',
      body: JSON.stringify({
        endTime: end,
        eventId,
        eventType,
        name,
        ownerId,
        playerPrice: formattedPlayerPrice,
        playerTaxes,
        startTime: start,
        teamPrice: formattedTeamPrice,
        teamTaxes,
        informations: infos,
        manualAcceptation,
      }),
    });

    if (res.status === REQUEST_STATUS_ENUM.ERROR) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('an_error_has_occured'),
        severity: SEVERITY_ENUM.ERROR,
      });
      return;
    } else {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('option_created_succes'),
        severity: SEVERITY_ENUM.SUCCESS,
      });
      goTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.SETTINGS });
    }
  };

  const getAccounts = async () => {
    const { data } = await api(formatRoute('/api/stripe/eventAccounts', null, { eventId }));

    if (!data) {
      return;
    }

    const res = data.map((r) => ({
      value: r.id,
      display: `${r?.name} ${r?.surname}`,
      key: r.id,
    }));

    setOwnersId(res);
    if (res[0]) {
      formik.setFieldValue('ownerId', res[0].value);
    }
  };

  const getEventType = async () => {
    const { data } = await api(formatRoute('/api/entity/event', null, { eventId }));
    if (!data) {
      return;
    }

    formik.setFieldValue('eventType', data.type);
  };

  const onManualAcceptationChange = (value) => {
    formik.setFieldValue('manualAcceptation', value);
  };

  const handleCancelTeam = () => {
    if (!edit) {
      clearTeamsFee();
    }
    setEdit(false);
    setOpenTeam(false);
  };
  const handleCloseTeam = () => {
    setEdit(false);
    setOpenTeam(false);
  };

  const handleOpenTeam = () => {
    setOpenTeam(true);
  };

  const handleEditTeam = () => {
    setEdit(true);
    setOpenTeam(true);
  };

  const handleEditPlayer = () => {
    setEdit(true);
    setOpenPlayer(true);
  };

  const handleOpenPlayer = () => {
    setOpenPlayer(true);
  };

  const handleCancelPlayer = () => {
    if (!edit) {
      clearPlayerFee();
    }
    setEdit(false);
    setOpenPlayer(false);
  };
  const handleClosePlayer = () => {
    setEdit(false);
    setOpenPlayer(false);
  };

  const handleSavePlayer = (playerPriceTotal) => {
    setPlayerPriceTotal(playerPriceTotal);
    setOpenPlayer(false);
  };

  const handleSaveTeam = (teamPriceTotal) => {
    setTeamPriceTotal(teamPriceTotal);
    setOpenTeam(false);
  };

  const validate = (values) => {
    const { teamPrice, playerPrice, ownerId, openDate, openTime, closeDate, closeTime } = values;
    const errors = {};

    if (teamPrice > 0 && !ownerId) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_bank_account_linked'),
        severity: SEVERITY_ENUM.ERROR,
      });
      errors.teamPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
    }

    if (playerPrice > 0 && !ownerId) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('no.no_bank_account_linked'),
        severity: SEVERITY_ENUM.ERROR,
      });
      errors.playerPrice = t(ERROR_ENUM.VALUE_IS_INVALID);
    }
    if (closeDate < openDate) {
      errors.closeDate = t(ERROR_ENUM.CLOSE_AFTER_OPEN);
    }
    if (closeDate === openDate && closeTime < openTime) {
      errors.closeTime = t(ERROR_ENUM.CLOSE_AFTER_OPEN);
    }
    return errors;
  };

  const clearTeamsFee = () => {
    setTeamPriceTotal(undefined);
    formik.setFieldValue('teamPrice', '');
    formik.setFieldValue('teamTaxes', '');
  };

  const clearPlayerFee = () => {
    setPlayerPriceTotal(undefined);
    formik.setFieldValue('playerPrice', '');
    formik.setFieldValue('playerTaxes', '');
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    openDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    closeDate: yup.date().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    openTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    closeTime: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      teamPrice: '',
      teamTaxes: '',
      playerPrice: '',
      ownerId: ``,
      openDate: moment().format('YYYY-MM-DD'),
      openTime: '00:00',
      closeDate: moment().add(1, 'month').format('YYYY-MM-DD'),
      closeTime: '23:59',
      informations: '',
      eventType: EVENT_TYPE.TEAM,
      manualAcceptation: false,
    },
    validationSchema,
    validate,
    validateOnChange: false,
    onSubmit: (values) => {
      if (values.eventType === EVENT_TYPE.PLAYER) {
        values.teamPrice = undefined;
      }
      setIsSubmitting(true);

      addOptionToEvent({ ...values });
    },
  });

  const fields = useFields(FIELD_GROUP_ENUM.ADD_PAYMENT_OPTION, {
    teamOnClick: handleOpenTeam,
    ownersId,
    playerPriceTotal,
    teamPriceTotal,
    onClickEditTeamsFee: handleEditTeam,
    onClickDeleteTeamsFee: clearTeamsFee,
    eventType: formik.values.eventType,
    playerOnClick: handleOpenPlayer,
    onClickEditPlayerFee: handleEditPlayer,
    onClickDeletePlayerFee: clearPlayerFee,
    onManualAcceptationChange,
    manualAcceptation: formik.values.manualAcceptation,
  });

  return (
    <IgContainer>
      <Paper style={{ textAlign: 'center' }}>
        <Typography variant="h3" style={{ marginTop: 20 }}>
          {t('payment.create_payment_option')}
        </Typography>
        <AddTeamFeeDialog
          open={openTeam}
          formik={formik}
          update={() => {}}
          edit={edit}
          onCancel={handleCancelTeam}
          onClose={handleCloseTeam}
          title={t('delete.delete_comment_confirmation')}
          onSubmit={handleCloseTeam}
          onSave={handleSaveTeam}
        />
        <AddPlayerFeeDialog
          open={openPlayer}
          formik={formik}
          update={() => {}}
          edit={edit}
          onCancel={handleCancelPlayer}
          onClose={handleClosePlayer}
          title={t('delete.delete_comment_confirmation')}
          onSubmit={handleClosePlayer}
          onSave={handleSavePlayer}
        />
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            {fields.map((field, index) => (
              <div style={{ marginTop: '8px' }} key={index}>
                <ComponentFactory component={{ ...field, formik }} />
              </div>
            ))}
          </DialogContent>
          <div className={styles.divButton}>
            <Button
              style={{ marginRight: 8 }}
              color="secondary"
              onClick={() => {
                goBack();
              }}
            >
              {t('cancel')}
            </Button>
            <Button style={{ marginLeft: 8 }} disabled={isSubmitting} type="submit">
              {t('confirm')}
            </Button>
          </div>
        </form>
      </Paper>
    </IgContainer>
  );
}
