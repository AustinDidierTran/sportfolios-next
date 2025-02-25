import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import SetupPrimaryPersonFirstPage, { PrimaryPersonState } from './FirstPage';
import SetupPrimaryPersonSecondPage, { EmergencyContactState } from './SecondPage';
import SetupPrimaryPersonThirdPage, { PaymentMethodState } from './ThirdPage';
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { postInitialUserConfig } from '../../../../../actions/service/user';
import { CreateTokenCardData, Token } from '@stripe/stripe-js';
import { ERROR_ENUM, ROUTES_ENUM } from '../../../../../../common/enums';
import { goTo, ROUTES } from '../../../../../actions/goTo';
import { keepOnlyDigits } from '../../../../../utils/stringFormats';
import { ACTION_ENUM, Store } from '../../../../../Store';

export interface InitialUserConfig {
  primaryPerson: PrimaryPersonState;
  emergencyContact: EmergencyContactState;
  stripeToken: Token;
}

const PreviousButton = styled.button`
  border: none;
  background: none;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  color: ${(props) => (props.disabled ? props.theme.shadesOfGrey.main : props.theme.shadesOfGrey.dark)};

  svg {
    height: 1rem !important;
    width: 1rem;
  }
`;

const ActionButton = styled.button`
  border: none;
  background: none;
  font-size: 1rem;
  color: ${(props) => (props.disabled ? props.theme.shadesOfGrey.main : props.theme.blue.main)};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`;

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  max-height: 700px;

  svg {
    color: ${(props) => props.theme.shadesOfGrey.dark};
    width: 5.5rem;
    height: 5.5rem;
  }

  @media (min-height: 700px) {
    margin-top: calc(50vh - 350px);
  }
`;

const ActionDiv = styled.div`
  padding: 0 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 3rem;
  justify-content: space-between;

  width: 100%;
`;

const Footer = styled.div`
  height: 6rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DotContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.5rem;
  align-items: center;
`;

const Dot = styled.button`
  border: none;
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background-color: ${(props) => (props.disabled ? props.theme.shadesOfGrey.light : props.theme.blue.main)};
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  flex: 1;
`;

export enum GENDER_OPTIONS {
  MALE = 'Male',
  FEMALE = 'Female',
  NOT_SPECIFIED = 'Other',
}

const SetupPrimaryPerson: React.FunctionComponent = () => {
  const { t } = useTranslation();

  const stripe = useStripe();
  const elements = useElements();

  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  useEffect(() => {
    if (userInfo?.persons?.length) {
      goTo(ROUTES_ENUM.home);
    }
  }, [userInfo?.persons?.length]);

  // NEW CODE HERE
  const [primaryPersonState, setPrimaryPersonState] = useState<PrimaryPersonState>({
    image: null,
    photoUrl: '',
    name: '',
    surname: '',
    gender: GENDER_OPTIONS.MALE,
    birthDate: '',
    phoneNumber: '',
    formattedAddress: '',
    outputAddress: null,
  });

  const [emergencyContactState, setEmergencyContactState] = useState<EmergencyContactState>({
    name: '',
    surname: '',
    phoneNumber: '',
    formattedAddress: '',
    outputAddress: null,
  });

  const [paymentMethodState, setPaymentMethodState] = useState<PaymentMethodState>({
    name: '',
    formattedBillingAddress: '',
    outputBillingAddress: null,
    token: '',
  });

  const firstFormComplete = useMemo(() => {
    if (!primaryPersonState.name) {
      return false;
    }
    if (!primaryPersonState.surname) {
      return false;
    }
    if (!primaryPersonState.phoneNumber) {
      return false;
    }
    if (!primaryPersonState.outputAddress) {
      return false;
    }

    return true;
  }, [
    primaryPersonState.name,
    primaryPersonState.surname,
    primaryPersonState.phoneNumber,
    primaryPersonState.outputAddress,
  ]);

  const secondFormComplete = useMemo(() => {
    if (!emergencyContactState.name) {
      return false;
    }
    if (!emergencyContactState.surname) {
      return false;
    }
    if (!emergencyContactState.phoneNumber) {
      return false;
    }
    if (!emergencyContactState.outputAddress) {
      return false;
    }
    return true;
  }, [
    emergencyContactState.name,
    emergencyContactState.surname,
    emergencyContactState.phoneNumber,
    emergencyContactState.outputAddress,
  ]);

  const [formIndex, setFormIndex] = useState<number>(0);

  useEffect(() => {
    setPaymentMethodState((p: PaymentMethodState) => ({
      ...p,
      formattedBillingAddress: primaryPersonState.formattedAddress,
      outputBillingAddress: primaryPersonState.outputAddress,
    }));
  }, [primaryPersonState.formattedAddress]);

  const [paymentMethodError, setPaymentMethodError] = useState<string>('');

  const onSubmit = useCallback(
    async (skipStripe) => {
      try {
        let token: Token = null;

        if (!skipStripe) {
          // Fetch token, and send error message if it doesn't work

          if (!paymentMethodState.name) {
            throw new Error(ERROR_ENUM.ERROR_OCCURED);
          }

          if (!paymentMethodState.formattedBillingAddress) {
            throw new Error(ERROR_ENUM.ERROR_OCCURED);
          }

          const stripeExtraData: CreateTokenCardData = {
            name: paymentMethodState.name,
            address_line1: paymentMethodState.outputBillingAddress.street_address,
            address_city: paymentMethodState.outputBillingAddress.city,
            address_state: paymentMethodState.outputBillingAddress.state,
            address_zip: paymentMethodState.outputBillingAddress.zip,
            address_country: paymentMethodState.outputBillingAddress.country,
            currency: 'CAD',
          };

          const res = await stripe.createToken(elements.getElement(CardNumberElement), stripeExtraData);
          token = res.token;
        }

        // Send data to backend
        const data = {
          primaryPerson: {
            image: primaryPersonState.image,
            photoUrl: primaryPersonState.photoUrl,
            name: primaryPersonState.name,
            surname: primaryPersonState.surname,
            gender: primaryPersonState.gender,
            birthDate: primaryPersonState.birthDate,
            phoneNumber: keepOnlyDigits(primaryPersonState.phoneNumber),
            formattedAddress: primaryPersonState.formattedAddress,
            outputAddress: primaryPersonState.outputAddress,
          },
          emergencyContact: secondFormComplete
            ? {
                name: emergencyContactState.name,
                surname: emergencyContactState.surname,
                phoneNumber: keepOnlyDigits(emergencyContactState.phoneNumber),
                formattedAddress: emergencyContactState.formattedAddress,
                outputAddress: emergencyContactState.outputAddress,
              }
            : null,
          stripeToken: token,
        };

        const userInfo = await postInitialUserConfig(data);

        dispatch({
          type: ACTION_ENUM.UPDATE_USER_INFO,
          payload: userInfo,
        });

        goTo(ROUTES.home);
      } catch (error) {
        setPaymentMethodError(t(`errors.${error.message}`));
      }
    },
    [primaryPersonState, secondFormComplete, emergencyContactState, paymentMethodState]
  );

  const stepsData = [
    {
      previous: {
        disabled: true,
      },
      next: {
        disabled: !firstFormComplete,
        onClick: () => {
          setFormIndex(1);
          if (!paymentMethodState.name)
            setPaymentMethodState((state) => ({
              ...state,
              name: `${primaryPersonState.name} ${primaryPersonState.surname}`,
            }));
        },
        label: t('auth.next'),
      },
      skip: {
        hidden: true,
      },
    },
    {
      previous: {
        disabled: false,
        onClick: () => setFormIndex(0),
      },
      next: {
        disabled: !secondFormComplete,
        onClick: () => setFormIndex(2),
        label: t('auth.next'),
      },
      skip: {
        hidden: false,
        onClick: () => setFormIndex(2),
      },
    },
    {
      previous: {
        disabled: true,
        onClick: () => setFormIndex(1),
      },
      next: {
        onClick: () => onSubmit(false),
        label: t('auth.done'),
      },
      skip: {
        hidden: false,
        onClick: () => onSubmit(true),
      },
    },
  ];

  return (
    <Container>
      <ActionDiv>
        <PreviousButton
          disabled={stepsData[formIndex].previous.disabled}
          onClick={stepsData[formIndex].previous.onClick}
        >
          <ArrowBackIos></ArrowBackIos>
        </PreviousButton>
        <ActionButton disabled={stepsData[formIndex].next.disabled} onClick={stepsData[formIndex].next.onClick}>
          {stepsData[formIndex].next.label}
        </ActionButton>
      </ActionDiv>
      {formIndex === 0 ? (
        <SetupPrimaryPersonFirstPage state={primaryPersonState} setState={setPrimaryPersonState} />
      ) : formIndex === 1 ? (
        <SetupPrimaryPersonSecondPage state={emergencyContactState} setState={setEmergencyContactState} />
      ) : (
        <SetupPrimaryPersonThirdPage
          state={paymentMethodState}
          setState={setPaymentMethodState}
          error={paymentMethodError}
        />
      )}
      <Footer>
        <DotContainer>
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <Dot key={index} disabled={formIndex !== index} />
            ))}
        </DotContainer>
        <ActionButton hidden={stepsData[formIndex].skip.hidden} onClick={stepsData[formIndex].skip.onClick}>
          {t('auth.skip')}
        </ActionButton>
      </Footer>
    </Container>
  );
};

export default SetupPrimaryPerson;
