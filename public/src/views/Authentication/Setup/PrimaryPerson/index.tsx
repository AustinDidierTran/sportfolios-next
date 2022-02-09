import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { RcFile } from 'rc-upload/lib/interface';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import Upload from 'rc-upload';
import * as yup from 'yup';

import AccountCircle from '@material-ui/icons/AccountCircle';

import LabelAndTextInput from '../../../../components/Styled/LabelAndInput/LabelAndTextInput';
import LabelAndSelectInput from '../../../../components/Styled/LabelAndInput/LabelAndSelectInput';
import LabelAndDateInput from '../../../../components/Styled/LabelAndInput/LabelAndDateInput';
import moment from 'moment';
import LabelAndPhoneNumberInput from '../../../../components/Styled/LabelAndInput/LabelAndPhoneNumberInput';

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
  justify-content: end;
  color: ${(props) => props.theme.blue.main};
  width: 100%;

  span {
    cursor: pointer;
  }
`;

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

const FormContainer = styled.div`
  padding: 2rem 1rem;
`;

const SetupPrimaryPerson: React.FunctionComponent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { redirectUrl } = router.query;

  const validationSchema = yup.object().shape({
    name: yup.string().required(),
    surname: yup.string().required(),
    gender: yup.string().oneOf(['male', 'female', 'not_specified']),
    birthDay: yup.number().required(),
    birthMonth: yup.number().required(),
    birthYear: yup.number().required(),
    phoneNumber: yup.number().required(),
    address: yup.string().required(),
  });

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // NEW CODE HERE

  // Photo
  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file: RcFile) {
      if (file.type.split('/')[0] === 'image') {
        console.log(file);
        setImage(file);
        setPhotoUrl(URL.createObjectURL(file));
      } else {
        setErrorMessage('upload has failed');
      }
    },
  };
  const [image, setImage] = useState<RcFile>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');

  // Form
  const [name, setName] = useState<string>('');
  const [surname, setSurname] = useState<string>('');
  const [gender, setGender] = useState<string>('male');
  const [birthDate, setBirthDate] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  useEffect(() => {
    console.log(image);
  }, [image]);

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
    <Container>
      <ActionDiv>
        <span>{t('auth.next')}</span>
      </ActionDiv>
      {image ? <AvatarImage src={photoUrl} /> : <AccountCircle width={88} height={88} />}
      <Upload {...uploadImageProps}>
        <UploadText>{t('auth.add_profile_picture')}</UploadText>
      </Upload>
      <Divider />
      <FormContainer>
        <LabelAndTextInput
          label={t('auth.fields.name')}
          placeholder={t('auth.fields.name')}
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setName(e.target.value);
          }}
        />
        <LabelAndTextInput
          label={t('auth.fields.surname')}
          placeholder={t('auth.fields.surname')}
          value={surname}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSurname(e.target.value);
          }}
        />
        <LabelAndSelectInput
          label={t('auth.fields.gender')}
          placeholder={t('auth.fields.gender')}
          options={genderOptions}
          value={gender}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGender(e.target.value);
          }}
        />
        <LabelAndDateInput
          label={t('auth.fields.birthDate')}
          placeholder={t('auth.fields.birthDate')}
          value={birthDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setBirthDate(e.target.value);
          }}
        />
        <LabelAndPhoneNumberInput
          label={t('auth.fields.phoneNumber')}
          placeholder={t('auth.fields.phoneNumber')}
          value={phoneNumber}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPhoneNumber(e.target.value);
          }}
        />
      </FormContainer>
    </Container>
  );
};

export default SetupPrimaryPerson;
