import React, { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { ERROR_ENUM } from '../../../../../common/errors';
import api from '../../../../actions/api';
import { Store, ACTION_ENUM } from '../../../../Store';
import { SEVERITY_ENUM, REQUEST_STATUS_ENUM, COMPONENT_TYPE_ENUM } from '../../../../../common/enums';
import BasicFormDialog from '../BasicFormDialog';
import LoadingSpinner from '../../LoadingSpinner';
import { uploadFile } from '../../../../actions/aws';

export default function EditMembershipTermsAndConditions(props) {
  const { open: openProps, onClose, update, id, fileName, fileUrl, description } = props;
  const { t } = useTranslation();
  const { dispatch } = useContext(Store);

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const uploadProps = {
    multiple: false,
    accept: '.pdf',
    onStart(file) {
      // Show preview
      if (file.type.split('/')[1] === 'pdf') {
        setFile(file);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_format_pdf'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const formik = useFormik({
    initialValues: {
      fileName: '',
      fileUrl: '',
      description: '',
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      const { description } = values;
      setIsLoading(true);
      let newFileUrl = fileUrl;
      let newFileName = fileName;
      if (!file) {
        newFileUrl = null;
        newFileName = null;
      } else if (file.type.split('/')[1] === 'pdf') {
        newFileName = file.name;
        newFileUrl = await uploadFile(file);
        if (!newFileUrl) {
          dispatch({
            type: ACTION_ENUM.SNACK_BAR,
            message: t('invalid.invalid_file'),
            severity: SEVERITY_ENUM.ERROR,
          });
          return;
        }
      }

      const res = await api(`/api/entity/updateMembershipTermsAndConditions`, {
        method: 'PUT',
        body: JSON.stringify({
          id,
          description,
          fileName: newFileName,
          fileUrl: newFileUrl,
        }),
      });

      if (res.status === REQUEST_STATUS_ENUM.ERROR || res.status >= 400) {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: ERROR_ENUM.ERROR_OCCURED,
          severity: SEVERITY_ENUM.ERROR,
          duration: 4000,
        });
        return;
      }

      dispatch({
        type: ACTION_ENUM.SNACK_BAR,
        message: t('member.membership_edited'),
        severity: SEVERITY_ENUM.SUCCESS,
        duration: 2000,
      });
      update();
      handleClose();
      setIsLoading(false);
      setFile(null);
    },
  });

  useEffect(() => {
    formik.setFieldValue('description', description);
    setOpen(openProps);

    if (fileName) {
      let file = new File([], fileName);
      setFile(file);
    }
  }, [openProps]);

  const handleClose = () => {
    onClose();
  };

  const fields = [
    file
      ? {
          componentType: COMPONENT_TYPE_ENUM.LIST,
          icon: 'Delete',
          primary: file?.name,
          onIconClick: () => {
            setFile(null);
          },
          tooltip: t('delete.delete'),
        }
      : {
          componentType: COMPONENT_TYPE_ENUM.FILE_UPLOAD,
          props: uploadProps,
          buttonName: t('upload_terms_and_conditions'),
        },
    {
      componentType: COMPONENT_TYPE_ENUM.TEXT_FIELD_BOX,
      namespace: 'description',
      label: t('description.description_optional'),
      variant: 'filled',
      rows: 5,
      rowsMax: 15,
      style: { width: '100%' },
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
      title={t('edit.edit_terms_and_conditions')}
      buttons={buttons}
      fields={fields}
      formik={formik}
      onClose={handleClose}
    />
  );
}
