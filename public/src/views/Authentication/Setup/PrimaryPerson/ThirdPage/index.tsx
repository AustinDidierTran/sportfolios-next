import React, { Dispatch, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FormContainer, GENDER_OPTIONS } from '..';
import LabelAndAddressInput, {
  OutputAddress,
} from '../../../../../components/Styled/LabelAndInput/LabelAndAddressInput';
import LabelAndPhoneNumberInput from '../../../../../components/Styled/LabelAndInput/LabelAndPhoneNumberInput';
import LabelAndTextInput from '../../../../../components/Styled/LabelAndInput/LabelAndTextInput';
import StripeElement from '../../../../../components/Styled/StripeElement';
import CardSection from '../../../../../utils/stripe/CardSection';

export interface PaymentMethodState {
  name: string;
  formattedBillingAddress: string;
  outputBillingAddress: OutputAddress;
  token: string;
}

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: red;
  text-align: center;
  margin-top: 0.5rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: normal;
`;

const Description = styled.span`
  color: ${(props) => props.theme.text.description};
  font-size: 0.75rem;
  margin-bottom: 2.5rem;
  text-align: center;
  width: 80%;
`;

interface Props {
  error: string;
  state: PaymentMethodState;
  setState: Dispatch<any>;
}

const SetupPrimaryPersonThirdPage: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();

  const onChange = useCallback(
    (key, value) =>
      props.setState((currentState: PaymentMethodState) => ({
        ...currentState,
        [key]: value,
      })),
    [props.setState]
  );

  return (
    <FormContainer>
      <Title>{t('auth.payment_method')}</Title>
      <Description>{t('auth.payment_method_description')}</Description>
      <LabelAndTextInput
        label={t('auth.fields.card_name')}
        placeholder={t('auth.fields.name_on_card')}
        value={props.state.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange('name', e.target.value);
        }}
      />
      <StripeElement />
      <LabelAndAddressInput
        label={t('auth.fields.address')}
        placeholder={t('auth.fields.address')}
        onChange={(value) => onChange('formattedBillingAddress', value)}
        onPlaceChange={(newOutputAddress, newFormattedAddress) => {
          onChange('outputAddress', newOutputAddress);
          onChange('formattedAddress', newFormattedAddress);
        }}
        value={props.state.formattedBillingAddress}
      />
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </FormContainer>
  );
};

export default SetupPrimaryPersonThirdPage;
