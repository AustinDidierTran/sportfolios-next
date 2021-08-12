import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import LoadingSpinner from '../../LoadingSpinner';
import { uploadPicture } from '../../../../actions/aws';
import * as yup from 'yup';

export default function EditPartner(props) {
  const { open: openProps, onClose, id, name, website, photoUrl: photoUrlProps, description } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(photoUrlProps);
  const [img, setImg] = useState(null);

  useEffect(() => {
    setPhotoUrl(photoUrlProps);
  }, [photoUrlProps]);

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file) {
      // Show preview
      if (file.type.split('/')[0] === 'image') {
        setImg(file);
        setPhotoUrl(URL.createObjectURL(file)); // used as a preview only
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const validationSchema = yup.object().shape({
    name: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    description: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
    website: yup.string().required(t(ERROR_ENUM.VALUE_IS_REQUIRED)),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      website: '',
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { name, description, website } = values;
      setIsLoading(true);
      let newPhotoUrl = photoUrl;
      if (img && img.type.split('/')[0] === 'image') {
        newPhotoUrl = await uploadPicture(entityId, img);
        if (newPhotoUrl) {
          setPhotoUrl(photoUrl);
        } else {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('invalid.invalid_file_image'),
            severity: SEVERITY_ENUM.ERROR,
          });
          setIsLoading(false);
          return;
        }
      }
      let desc = description;
      if (!description) {
        desc = null;
      }

      const res = await api(`/api/entity/partner`, {
        method: 'PUT',
        body: JSON.stringify({
          id,
          name,
          description: desc,
          website,
          photoUrl: newPhotoUrl,
        }),
      });
      if (res.status === REQUEST_STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('partner.partner_edited'),
          severity: SEVERITY_ENUM.SUCCESS,
          duration: 2000,
        });
        onClose();
      }
      setIsLoading(false);
    },
  });

  useEffect(() => {
    formik.setFieldValue('name', name);
    formik.setFieldValue('description', description);
    formik.setFieldValue('photoUrl', photoUrl);
    formik.setFieldValue('website', website);
    setOpen(openProps);
  }, [openProps]);

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.IMAGE_UPLOAD,
      namespace: 'photo',
      buttonName: t('upload_image'),
      uploadImageProps,
      photoUrl,
    },
    {
      namespace: 'name',
      label: t('name'),
    },
    {
      componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
      namespace: 'description',
      label: t('description.description'),
      variant: 'filled',
      rows: 5,
      rowsMax: 15,
      style: { width: '100%' },
    },
    {
      namespace: 'website',
      label: t('link_to_website'),
    },
  ];

  const buttons = [
    {
      onClick: onClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('edit.edit'),
      color: 'primary',
    },
  ];

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <BasicFormDialog
      open={open}
      title={t('edit.edit_partner')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={onClose}
    />
  );
}
