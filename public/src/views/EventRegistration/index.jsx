import React, { useEffect, useState, useContext } from 'react';
import Paper from '../../components/Custom/Paper';
import StepperWithHooks from '../../components/Custom/StepperWithHooks';
import IgContainer from '../../components/Custom/IgContainer';
import LoadingSpinner from '../../components/Custom/LoadingSpinner';
import Roster from './Roster';
import { useStepper } from '../../hooks/forms';
import api from '../../actions/api';
import { ROUTES, goTo, goToAndReplace } from '../../actions/goTo';
import { useTranslation } from 'react-i18next';
import {
  INVOICE_STATUS_ENUM,
  GLOBAL_ENUM,
  SEVERITY_ENUM,
  REQUEST_STATUS_ENUM,
  REJECTION_ENUM,
  TABS_ENUM,
} from '../../../common/enums';
import styles from './EventRegistration.module.css';
import Typography from '@material-ui/core/Typography';
import { Store, ACTION_ENUM } from '../../Store';
import { ERROR_ENUM, errors } from '../../../common/errors';
import { useFormik } from 'formik';
import { formatRoute } from '../../utils/stringFormats';
import dynamic from 'next/dynamic';
import CustomIconButton from '../../components/Custom/IconButton';

const PersonSelect = dynamic(() => import('./PersonSelect'));
const PaymentOptionSelect = dynamic(() => import('./PaymentOptionSelect/index'));
const TeamSelect = dynamic(() => import('./TeamSelect/index'));
const AdditionalInformation = dynamic(() => import('./AdditionalInformation'));

const getEvent = (eventId) => {
  return api(formatRoute('/api/entity/eventInfos', null, { id: eventId }), { method: 'GET' }).then((res) => res.data);
};

export default function EventRegistration() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    state: { isAuthenticated, id: eventId },
    dispatch,
  } = useContext(Store);

  const [requiredInfos, setRequiredInfos] = useState(false);

  const formik = useFormik({
    initialValues: {
      event: {},
      team: undefined,
      persons: [],
      allPersons: [],
      roster: [],
      paymentOption: '',
      paymentOptions: [],
      teamSearchQuery: '',
      teamActivity: '',
      informations: '',
    },
    onSubmit: async (values) => {
      const { event, team, roster, paymentOption, persons, informations } = values;
      let newTeamId = null;
      setIsLoading(true);
      if (event.eventType === 'teamTournament' || formik.values.event.eventType === 'team') {
        if (!team.id) {
          const tempTeam = await api('/api/entity', {
            method: 'POST',
            body: JSON.stringify({ name: team.name, type: GLOBAL_ENUM.TEAM }),
          });
          newTeamId = tempTeam.data.id;
        }
        //Check if team is accepted here
        const { status, data } = await api('/api/entity/register', {
          method: 'POST',
          body: JSON.stringify({
            teamId: newTeamId || team.id,
            eventId: event.id,
            paymentOption,
            roster,
            status: INVOICE_STATUS_ENUM.OPEN,
            informations,
          }),
        });

        setIsLoading(false);
        if (status < 300) {
          goTo(ROUTES.registrationStatus, null, {
            status: data.status,
            eventId,
          });
          return;
        }
        if (status === errors[ERROR_ENUM.REGISTRATION_ERROR].code) {
          goTo(ROUTES.registrationStatus, null, {
            status: data.status,
            reason: data.reason,
            eventId,
          });
          return;
        }
        return;
      }
      //TODO informations ici
      const { status, data } = await api('/api/entity/registerIndividual', {
        method: 'POST',
        body: JSON.stringify({
          eventId: event.id,
          paymentOption,
          persons,
          status: INVOICE_STATUS_ENUM.OPEN,
          informations,
        }),
      });
      if (status === REQUEST_STATUS_ENUM.SUCCESS) {
        goTo(ROUTES.registrationStatus, null, {
          status: data.status,
          rosterId: data.rosterId,
          eventId,
        });
        return;
      }
      if (data.reason === REJECTION_ENUM.ALREADY_REGISTERED) {
        const names = data.persons.reduce((prev, curr, index) => {
          if (index === 0) {
            return prev + curr.name;
          } else {
            return `${prev} ${t('and_lowerCased')} ${curr.name}`;
          }
        }, '');
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message:
            data.persons.length === 1
              ? t('register.already_registered_singular', { names })
              : t('register.already_registered', { names }),
          severity: SEVERITY_ENUM.ERROR,
          duration: 6000,
        });
        setIsLoading(false);
        return;
      }
      goTo(ROUTES.registrationStatus, null, {
        status: data.status,
        reason: data.reason,
        eventId,
      });

      setIsLoading(false);
    },
  });

  useEffect(() => {
    formik.setFieldValue('teamActivity', true);
    if (!eventId) {
      return;
    }
    if (!isAuthenticated) {
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('you.you_need_to_create_an_account'),
        severity: SEVERITY_ENUM.INFO,
      });
      goToAndReplace(ROUTES.login, null, {
        redirectUrl: `/page/eventRegistration/${eventId}`,
      });
      return;
    }
    getData();
  }, [eventId]);

  useEffect(() => {
    const paymentOption = formik.values.paymentOptions.find((p) => p.value === formik.values.paymentOption);
    formik.setFieldValue('teamActivity', paymentOption?.teamActivity);
    setRequiredInfos(paymentOption?.informations);
  }, [formik.values.paymentOption]);

  const getData = async () => {
    const event = await getEvent(eventId);
    formik.setFieldValue('event', event);
  };

  const stepHook = useStepper();

  const handleBack = (activeStep) => {
    stepHook.handleNotCompleted(activeStep);
  };

  const additionalInformation = {
    label: t('informations'),
    content: (
      <AdditionalInformation
        stepHook={stepHook}
        formik={formik}
        informations={requiredInfos}
        index={formik.values.teamActivity ? 3 : 2}
      />
    ),
  };

  const steps = [
    {
      label: t('payment.payment_options'),
      content: <PaymentOptionSelect stepHook={stepHook} formik={formik} />,
    },
    {
      label: t('team.team_select'),
      content: <TeamSelect stepHook={stepHook} formik={formik} />,
    },
    {
      label: t('roster'),
      content: <Roster stepHook={stepHook} formik={formik} />,
    },
  ];

  const individualSteps = [
    {
      label: t('payment.payment_options'),
      content: <PaymentOptionSelect stepHook={stepHook} formik={formik} />,
    },
    {
      label: t('person.person_select'),
      content: <PersonSelect formik={formik} stepHook={stepHook} />,
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <IgContainer>
      <Paper className={styles.paper}>
        <div className={styles.header}>
          <CustomIconButton
            icon="ArrowBack"
            onClick={() => goTo(ROUTES.entity, { id: eventId }, { tab: TABS_ENUM.EVENT_INFO })}
            tooltip={t('return_event')}
            className={styles.iconButton}
            style={{ color: 'primary' }}
          />
        </div>
        <div className={styles.typo}>
          <Typography variant="h3">{formik?.values?.event?.name || ''}</Typography>
        </div>
        <StepperWithHooks
          steps={
            formik.values.event.eventType === 'teamTournament' || formik.values.event.eventType === 'team'
              ? requiredInfos
                ? [...steps, additionalInformation]
                : steps
              : requiredInfos
              ? [...individualSteps, additionalInformation]
              : individualSteps
          }
          finish={formik.handleSubmit}
          Next={() => {}}
          Back={handleBack}
          {...stepHook.stepperProps}
        />
      </Paper>
    </IgContainer>
  );
}
