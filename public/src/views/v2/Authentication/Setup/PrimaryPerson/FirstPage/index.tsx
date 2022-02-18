import React, { Dispatch, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormContainer, GENDER_OPTIONS } from '..';
import LabelAndAddressInput, {
  OutputAddress,
} from '../../../../../../components/Styled/LabelAndInput/LabelAndAddressInput';
import LabelAndDateInput from '../../../../../../components/Styled/LabelAndInput/LabelAndDateInput';
import LabelAndPhoneNumberInput from '../../../../../../components/Styled/LabelAndInput/LabelAndPhoneNumberInput';
import LabelAndSelectInput from '../../../../../../components/Styled/LabelAndInput/LabelAndSelectInput';
import LabelAndTextInput from '../../../../../../components/Styled/LabelAndInput/LabelAndTextInput';

import AccountCircle from '@material-ui/icons/AccountCircle';

import Upload from 'rc-upload';

import styled from 'styled-components';
import { RcFile } from 'rc-upload/lib/interface';

const AvatarImage = styled.img`
  height: 5.5rem;
  width: 5.5rem;
  border-radius: 50%;
  margin-bottom: 0.5rem;
`;

const UploadText = styled.span`
  cursor: pointer;
  color: ${(props) => props.theme.blue.main};
  font-size: 0.75rem;
  font-family: 'SF Pro, Semibold';
`;

const Divider = styled.hr`
  height: 1px;
  background-color: ${(props) => props.theme.shadesOfGrey.light};
  border: none;
  width: 100%;
`;

export interface PrimaryPersonState {
  name: string;
  image: RcFile;
  photoUrl: string;
  surname: string;
  gender: GENDER_OPTIONS;
  birthDate: string;
  phoneNumber: string;
  formattedAddress: string;
  outputAddress: OutputAddress;
}

interface Props {
  state: PrimaryPersonState;
  setState: Dispatch<any>;
}

const SetupPrimaryPersonFirstPage: React.FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState<string>('');

  const onChange = useCallback(
    (key, value) =>
      props.setState((currentState: PrimaryPersonState) => ({
        ...currentState,
        [key]: value,
      })),
    [props.setState]
  );

  // Photo
  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file: RcFile) {
      if (file.type.split('/')[0] === 'image') {
        onChange('image', file);
        onChange('photoUrl', URL.createObjectURL(file));
      } else {
        setErrorMessage('upload has failed');
      }
    },
  };

  const genderOptions = useMemo(
    () => [
      {
        value: 'male',
        display: t('auth.gender.male'),
      },
      {
        value: 'female',
        display: t('auth.gender.female'),
      },
      {
        value: 'not_specified',
        display: t('auth.gender.not_specified'),
      },
    ],
    []
  );

  return (
    <FormContainer>
      {props.state.image ? <AvatarImage src={props.state.photoUrl} /> : <AccountCircle width={88} height={88} />}
      <Upload {...uploadImageProps}>
        <UploadText>{t('auth.add_profile_picture')}</UploadText>
      </Upload>
      <Divider />
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
      <LabelAndSelectInput
        label={t('auth.fields.gender')}
        placeholder={t('auth.fields.gender')}
        options={genderOptions}
        value={props.state.gender}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange('gender', e.target.value);
        }}
      />
      <LabelAndDateInput
        label={t('auth.fields.birthDate')}
        placeholder={t('auth.fields.birthDate')}
        value={props.state.birthDate}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onChange('birthDate', e.target.value);
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

export default SetupPrimaryPersonFirstPage;
