import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Upload from 'rc-upload';
import { Store, ACTION_ENUM } from '../../../Store';
import { SEVERITY_ENUM } from '../../../../common/enums';
import styles from './PostInput.module.css';
import TextField from '@material-ui/core/TextField';

import CustomIconButton from '../IconButton';
import { Primary } from '../Icon/Icon.stories';
export default function CustomDateInput(props) {
  const { t } = useTranslation();
  const { entityId, handlePost, canAddImage, postId = undefined, placeholder } = props;
  const { dispatch } = useContext(Store);

  const [postContent, setPostContent] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = async () => {
    handlePost(entityId, postContent, images, postId);
    setPostContent('');
    setImages([]);
  };

  const removeImage = (id) => {
    let oldImages = images;
    setImages(oldImages.filter((o) => o.file.uid !== id));
  };

  const uploadImageProps = {
    multiple: false,
    accept: '.jpg, .png, .jpeg, .gif, .webp',
    onStart(file) {
      if (file.type.split('/')[0] === 'image') {
        setImages((images) => [
          ...images,
          {
            file,
          },
        ]);
      } else {
        dispatch({
          type: ACTION_ENUM.SNACK_BAR,
          message: t('invalid_file_image'),
          severity: SEVERITY_ENUM.ERROR,
        });
      }
    },
  };

  const handleChange = (event) => {
    setPostContent(event.target.value);
  };

  return (
    <div>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <div className={styles.divRoot}>
          <TextField
            placeholder={placeholder}
            className={styles.textField}
            multiline
            rowsMax={Infinity}
            value={postContent}
            InputProps={{
              disableUnderline: true,
              endAdornment: (
                <div style={{ display: 'flex' }}>
                  <CustomIconButton
                    disabled={postContent.length == 0}
                    icon="Send"
                    style={{ color: Primary }}
                    onClick={handleSubmit}
                  />
                  {canAddImage && (
                    <Upload {...uploadImageProps}>
                      <CustomIconButton icon="ImageOutlinedIcon" style={{ color: Primary }} />
                    </Upload>
                  )}
                </div>
              ),
            }}
            onChange={handleChange}
          />
        </div>
      </div>
      <div>
        {images.map((image) => {
          return (
            <div className={styles.divImage}>
              <CustomIconButton
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  color: 'black',
                  backgroundColor: 'white',
                  borderRaduis: 25,
                  padding: 2,
                  margin: 5,
                }}
                icon="Clear"
                onClick={() => {
                  removeImage(image.file.uid);
                }}
              />
              <img className={styles.imagePreview} src={URL.createObjectURL(image.file)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
