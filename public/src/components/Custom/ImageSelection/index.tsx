import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ImageList from '@material-ui/core/ImageList';
import ImageListItem from '@material-ui/core/ImageListItem';
import { Image } from '../../../../../typescript/types';
import { getImages as getImagesApi } from '../../../actions/service/entity/get';
import styles from './ImagesList.module.css';
import { MOBILE_WIDTH } from '../../../../common/constants';
import { useWindowSize } from '../../../hooks/window';
import { Chip } from '..';
import CustomButton from '../Button';
import { IMAGE_TYPE_ENUM } from '../../../../common/enums';
import AddImage from './AddImage';
import { Typography } from '@material-ui/core';

interface IProps {
  formik: any;
  hasNoImage: boolean;
}

const ImagesList: React.FunctionComponent<IProps> = (props) => {
  const { formik, hasNoImage } = props;
  const { t } = useTranslation();
  const [width] = useWindowSize();

  const [imageList, setImageList] = useState<Image[]>([]);
  const [imageType, setImageType] = useState<string>(IMAGE_TYPE_ENUM.ALL);
  const [openAddImage, setOpenAddImage] = useState<boolean>(false);


  useEffect((): void => {
    getImages();
  }, [imageType]);

  const getImages = (): void => {
    getImagesApi(imageType).then(setImageList);
  };

  const CHIPS_MAP = [
    {
      label: IMAGE_TYPE_ENUM.ALL,
      type: IMAGE_TYPE_ENUM.ALL,
      onClick: (): void => setImageType(IMAGE_TYPE_ENUM.ALL),
    },
    {
      label: IMAGE_TYPE_ENUM.SOCCER,
      type: IMAGE_TYPE_ENUM.SOCCER,
      onClick: (): void => setImageType(IMAGE_TYPE_ENUM.SOCCER),
    },
    {
      label: IMAGE_TYPE_ENUM.FRISBEE,
      type: IMAGE_TYPE_ENUM.FRISBEE,
      onClick: (): void => setImageType(IMAGE_TYPE_ENUM.FRISBEE),
    },
    {
      label: IMAGE_TYPE_ENUM.BASEBALL,
      type: IMAGE_TYPE_ENUM.BASEBALL,
      onClick: (): void => setImageType(IMAGE_TYPE_ENUM.BASEBALL),
    },
    {
      label: IMAGE_TYPE_ENUM.VOLLEYBALL,
      type: IMAGE_TYPE_ENUM.VOLLEYBALL,
      onClick: (): void => setImageType(IMAGE_TYPE_ENUM.VOLLEYBALL),
    },
  ];

  const handleClose = (): void => {
    setOpenAddImage(false);
  };

  const getVariant = (type: string): string => {
    if (imageType == type) {
      return 'default';
    }
    return 'outlined';
  };

  return (
    <>
      <Typography className={styles.title} color={hasNoImage ? 'error' : 'textPrimary'}>
        {t('select.select_image')}
      </Typography>
      <div className={styles.dialogContent}>
        {CHIPS_MAP.map((c: any, index: number) => (
          <Chip
            key={index}
            onClick={c.onClick}
            label={t(c.label)}
            variant={getVariant(c.type)}
            className={styles.chip}
            clickable
          />
        ))}
      </div>
      <ImageList className={styles.imageList} cols={width > MOBILE_WIDTH ? 5 : 3}>
        <div className={styles.container}>
          <div className={styles.addImage}>
            <CustomButton
              className={styles.text}
              onClick={() => {
                setOpenAddImage(true);
              }}
            >
              {t('import_image')}
            </CustomButton>
          </div>
        </div>
        {imageList.map((img) => (
          <ImageListItem key={img.photoUrl} className={styles.container}>
            <img loading={'lazy'} className={styles.image} srcSet={img.photoUrl} />
            <div className={styles.middle}>
              <CustomButton
                className={styles.text}
                onClick={() => {
                  formik.setFieldValue('photoUrl', img.photoUrl);
                }}
              >
                {t('select.select')}
              </CustomButton>
            </div>
          </ImageListItem>
        ))}
      </ImageList>
      <AddImage open={openAddImage} formik={formik} onClose={handleClose} />
    </>
  );
};
export default ImagesList;
