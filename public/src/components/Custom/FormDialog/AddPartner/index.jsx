import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';

import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import { uploadPicture } from '../../../../actions/aws';
import * as yup from 'yup';
import LoadingSpinner from '../../LoadingSpinner';

export default function AddPartner(props) {
  const { open: openProps, onClose, update } = props;
  const { t } = useTranslation();
  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [img, setImg] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    setOpen(openProps);
  }, [openProps]);

  const handleClose = () => {
    formik.resetForm();
    setImg(null);
    setPhotoUrl('');
    update();
    onClose();
  };

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

      if (!img) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('image_required'),
          severity: SEVERITY_ENUM.ERROR,
        });
        return;
      }

      if (img.type.split('/')[0] != 'image') {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
        return;
      }

      setIsLoading(true);
      const photoUrl = await uploadPicture(entityId, img);

      if (photoUrl) {
        setPhotoUrl(photoUrl);
        let desc = description;
        if (!description) {
          desc = null;
        }
        const res = await api(`/api/entity/partner`, {
          method: 'POST',
          body: JSON.stringify({
            entityId,
            name,
            description: desc,
            website,
            photoUrl,
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
            message: t('partner.partner_added'),
            severity: SEVERITY_ENUM.SUCCESS,
            duration: 2000,
          });
          handleClose();
        }
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }

      setIsLoading(false);
    },
  });

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
      onClick: handleClose,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      type: 'submit',
      name: t('add.add'),
      color: 'primary',
    },
  ];

  if (isLoading) {
    return <LoadingSpinner isComponent />;
  }

  return (
    <BasicFormDialog
      open={open}
      title={t('add.add_partner')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
