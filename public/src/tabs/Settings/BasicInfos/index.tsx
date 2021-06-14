import React, { useState, useContext, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import styles from './BasicInfos.module.css';
import { uploadEntityPicture } from '../../../actions/aws';
import { ACTION_ENUM, Store } from '../../../Store';
import { useEditor } from '../../../hooks/roles';
import { changeEntityName } from '../../../actions/api';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Avatar from '../../../components/Custom/Avatar';
import Button from '../../../components/Custom/Button';
import Paper from '../../../components/Custom/Paper';
import LoadingSpinner from '../../../components/Custom/LoadingSpinner';
import TextField from '../../../components/Custom/TextField';
import { Entity, Role } from '../../../../../typescript/types';
import Upload from 'rc-upload';
import { SEVERITY_ENUM, STATUS_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import * as yup from 'yup';
import { useFormik } from 'formik';

interface IProps {
  basicInfos: Entity;
}

const BasicInfos: React.FunctionComponent<IProps> = (props) => {
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const {
    basicInfos: { id, name: initialName, photoUrl: initialPhotoUrl, role },
  } = props;

  const isEditor = useEditor(role);

  const [photoUrl, setPhotoUrl] = useState<string | undefined>(initialPhotoUrl);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [img, setImg] = useState<any>(null);

  useEffect((): void => {
    formik.setFieldValue('name', initialName);
  }, [initialName]);

  useEffect((): void => {
    setPhotoUrl(initialPhotoUrl);
  }, [initialPhotoUrl]);

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)).max(255, t(ERROR_ENUM.VALUE_IS_TOO_LONG)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { name } = values;

      setIsLoading(true);

      if (img) {
        const res = await onImgUpload();
        if (res.status >= 400) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: ERROR_ENUM.ERROR_OCCURED,
            severity: SEVERITY_ENUM.ERROR,
            duration: 4000,
          });
          setIsLoading(false);
          return;
        }
      }

      if (name != initialName) {
        const res = await changeEntityName(id, { name });

        if (res.status === STATUS_ENUM.ERROR || res.status >= 400) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: ERROR_ENUM.ERROR_OCCURED,
            severity: SEVERITY_ENUM.ERROR,
            duration: 4000,
          });
          setIsLoading(false);
          return;
        }
      }
      setEditMode(false);
      setIsLoading(false);
      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('saved'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 4000,
      });
    },
  });

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file: any) {
      // Show preview
      if (file.type.split('/')[0] === 'image') {
        setImg(file);
        setPhotoUrl(URL.createObjectURL(file));
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const onImgUpload = async (): Promise<{ status: number }> => {
    const photoUrl = await uploadEntityPicture(id, img);

    if (photoUrl) {
      setPhotoUrl(photoUrl);
      dispatch({
        type: ACTION_ENUM.UPDATE_ORGANIZATION_PROFILE_PICTURE,
        payload: photoUrl,
      });
      return { status: 200 };
    }
    return { status: 404 };
  };

  if (isEditMode) {
    return (
      <Paper style={{ textAlign: 'center' }} title={formik.values.name}>
        <form onSubmit={formik.handleSubmit}>
          <Container style={{ paddingBottom: '16px' }}>
            {isLoading ? (
              <LoadingSpinner isComponent />
            ) : (
              <Avatar className={styles.avatar} photoUrl={photoUrl} variant="square" size="lg" />
            )}
            <div>
              <Upload {...uploadImageProps}>
                <Button variant="outlined" endIcon="CloudUploadIcon" style={{ marginTop: '8px', marginBottom: '16px' }}>
                  {t('change_picture')}
                </Button>
              </Upload>
            </div>
            <TextField
              formik={formik}
              placeholder={t('name')}
              label={t('name')}
              className={styles.textField}
              namespace="name"
            />
            <div className={styles.editor}>
              <Button className={styles.save} type="submit" endIcon="Check" style={{ marginRight: '8px' }}>
                {t('save')}
              </Button>
              <Button
                className={styles.cancel}
                endIcon="Close"
                onClick={() => {
                  formik.setFieldValue('name', initialName);
                  setEditMode(false);
                }}
                style={{ marginLeft: '8px' }}
                color="secondary"
              >
                {t('cancel')}
              </Button>
            </div>
          </Container>
        </form>
      </Paper>
    );
  }

  return (
    <Paper title={formik.values.name}>
      <Container className={styles.paper}>
        <Avatar className={styles.avatar} photoUrl={photoUrl} variant="square" size="lg" />
        {formik.values.name ? (
          <div className={styles.fullName}>
            <Typography variant="h3" className={styles.title}>
              {formik.values.name}
            </Typography>
          </div>
        ) : (
          <></>
        )}
        {isEditor ? (
          <Container className={styles.edit}>
            <Button
              variant="contained"
              color="primary"
              className={styles.button}
              endIcon="Edit"
              onClick={() => {
                setEditMode(true);
              }}
              style={{ margin: '8px' }}
            >
              {t('edit.edit')}
            </Button>
          </Container>
        ) : (
          <></>
        )}
      </Container>
    </Paper>
  );
};
export default BasicInfos;
