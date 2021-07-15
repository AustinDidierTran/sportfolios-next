import React, { useState, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { COMPONENT_TYPE_ENUM, SEVERITY_ENUM } from '../../../../../common/enums';
import { ACTION_ENUM, Store } from '../../../../Store';
import BasicFormDialog from '../../FormDialog/BasicFormDialog';
import { uploadPicture } from '../../../../actions/aws';

interface IProps {
  open: boolean;
  formik: any;
  onClose: () => void;
}

interface Iimage {
  lastModified: number;
  lastModifiedDate: any;
  name: string;
  size: number;
  uid: string;
  webkitRelativePath: string;
  type: string;
}

const AddImage: React.FunctionComponent<IProps> = (props) => {
  const { open: openProps, formik, onClose } = props;
  const { t } = useTranslation();

  const {
    dispatch,
    state: { id: entityId },
  } = useContext(Store);

  const [img, setImg] = useState<Iimage>();

  const open = useMemo((): boolean => {
    return openProps;
  }, [openProps]);

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file: Iimage) {
      // Show preview
      if (file.type.split('/')[0] === 'image') {
        setImg(file);
        formik.setFieldValue('photoUrl', URL.createObjectURL(file)); // used as a preview only
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const onSubmit = async (): Promise<void> => {
    let newPhotoUrl = formik.values.photoUrl;
    if (img && img.type.split('/')[0] === 'image') {
      newPhotoUrl = await uploadPicture(entityId, img);
      if (newPhotoUrl) {
        formik.setFieldValue('photoUrl', newPhotoUrl);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid.invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
        return;
      }
    }
    onClose();
  };

  const onCancel = async (): Promise<void> => {
    formik.setFieldValue('photoUrl', '');
    onClose();
  };

  const fields = [
    {
      componentType: COMPONENT_TYPE_ENUM.IMAGE_UPLOAD,
      namespace: 'photo',
      buttonName: t('upload_image'),
      uploadImageProps,
      photoUrl: formik.values.photoUrl,
    },
  ];

  const buttons = [
    {
      onClick: onCancel,
      name: t('cancel'),
      color: 'secondary',
    },
    {
      onClick: onSubmit,
      name: t('edit.edit'),
      color: 'primary',
    },
  ];

  return (
    <>
      <BasicFormDialog
        open={open}
        title={t('import_image')}
        buttons={buttons}
        fields={fields}
        formik={formik}
        onClose={onClose}
      />
    </>
  );
};
export default AddImage;
