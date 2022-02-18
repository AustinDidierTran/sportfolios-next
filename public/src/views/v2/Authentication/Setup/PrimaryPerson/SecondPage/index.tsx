import React, { Dispatch, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FormContainer } from '..';
import LabelAndAddressInput, {
  OutputAddress,
} from '../../../../../../components/Styled/LabelAndInput/LabelAndAddressInput';
import LabelAndPhoneNumberInput from '../../../../../../components/Styled/LabelAndInput/LabelAndPhoneNumberInput';
import LabelAndTextInput from '../../../../../../components/Styled/LabelAndInput/LabelAndTextInput';

export interface EmergencyContactState {
  name: string;
  surname: string;
  phoneNumber: string;
  formattedAddress: string;
  outputAddress: OutputAddress;
}

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
  state: EmergencyContactState;
  setState: Dispatch<any>;
}

const SetupPrimaryPersonSecondPage: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();

  const onChange = useCallback(
    (key, value) =>
      props.setState((currentState: EmergencyContactState) => ({
        ...currentState,
        [key]: value,
      })),
    [props.setState]
  );

  return (
    <FormContainer>
      <Title>{t('auth.emergency_contact')}</Title>
      <Description>{t('auth.emergency_contact_description')}</Description>
      <LabelAndTextInput
        label={t('auth.fields.name')}
        placeholder={t('auth.fields.name')}
        value={props.state.name}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange('name', e.target.value);
        }}
      />
      <LabelAndTextInput
        label={t('auth.fields.surname')}
        placeholder={t('auth.fields.surname')}
        value={props.state.surname}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange('surname', e.target.value);
        }}
      />
      <LabelAndPhoneNumberInput
        label={t('auth.fields.phoneNumber')}
        placeholder={t('auth.fields.phoneNumber')}
        value={props.state.phoneNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange('phoneNumber', e.target.value);
        }}
      />
      <LabelAndAddressInput
        label={t('auth.fields.address')}
        onChange={(address) => onChange('formattedAddress', address)}
        onPlaceChange={(newOutputAddress, newFormattedAddress) => {
          onChange('outputAddress', newOutputAddress);
          onChange('formattedAddress', newFormattedAddress);
        }}
        placeholder={t('auth.fields.address')}
        value={props.state.formattedAddress}
      />
    </FormContainer>
  );
};

export default SetupPrimaryPersonSecondPage;
