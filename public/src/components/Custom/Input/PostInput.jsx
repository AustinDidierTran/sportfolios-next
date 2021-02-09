import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Upload from 'rc-upload';
import { Store, ACTION_ENUM } from '../../../Store';
import { SEVERITY_ENUM } from '../../../../common/enums';
import api from '../../../actions/api';
import { uploadPicture } from '../../../actions/aws';

export default function CustomDateInput(props) {
  const { t } = useTranslation();
  const {
    state: { userInfo },
    dispatch,
  } = useContext(Store);

  const [images, setImages] = useState([]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    const content = event.target.elements.content.value;

    const { data: postId } = await api('/api/posts/create', {
      method: 'POST',
      body: JSON.stringify({
        content: content,
        entity_id: userInfo.primaryPerson.entity_id,
      }),
    });

    images.map(async (image) => {
      const { file } = image;
      const url = await uploadPicture(postId, file);
      const { data } = await api('/api/posts/image', {
        method: 'POST',
        body: JSON.stringify({
          postId: postId,
          imageUrl: url,
        }),
      });
    });
    setImages([]);
  };

  const uploadImageProps = {
    multiple: true,
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="content"></input>
        <Upload {...uploadImageProps}>Upload image</Upload>
        <input type="submit" value="Envoyer"></input>
      </form>
    </div>
  );
}
