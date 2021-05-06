import api from '../api';
import axios from 'axios';

// 100 mb
const MAX_IMG_SIZE = 1024 * 1024 * 100;
const MAX_FILE_SIZE = 1024 * 1024 * 100;

const getSignature = async (imgType) => {
  return api(`/api/entity/s3Signature?fileType=${imgType}`);
};

const uploadToS3 = async (file, signedRequest) => {
  const options = {
    headers: {
      'Access-Control-Allow-Origin': 's3.amazonaws.com',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      'Content-Type': file.type,
    },
  };

  await axios.put(signedRequest, file, options);
};

const changeEntityURL = async (id, url) => {
  await api(`/api/entity`, {
    method: 'PUT',
    body: JSON.stringify({
      id,
      photoUrl: url,
    }),
  });
};

export async function uploadFile(file) {
  if (file.size > MAX_FILE_SIZE) {
    throw 'FIle is too big';
  }

  const { data } = await getSignature(file.type);

  await uploadToS3(file, data.signedRequest);

  return data.url;
}

export async function uploadEntityPicture(id, img) {
  if (!img || img.type.split('/')[0] != 'image') {
    throw 'Please select an image';
  }

  if (img.size > MAX_IMG_SIZE) {
    throw 'Image is too big';
  }

  const { data } = await getSignature(img.type);

  await uploadToS3(img, data.signedRequest);

  await changeEntityURL(id, data.url);

  return data.url;
}

export async function uploadPicture(id, img) {
  if (!img) {
    throw 'Please select an image';
  }

  if (img.size > MAX_IMG_SIZE) {
    throw 'Image is too big';
  }

  const { data } = await getSignature(img.type);

  await uploadToS3(img, data.signedRequest);

  return data.url;
}
