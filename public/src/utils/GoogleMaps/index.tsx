import { GOOGLE_PLACES_API_KEY } from '../../../../conf';

export const loadGooglePlaces = (callback: () => void): void => {
  const existingScript = document.getElementById('googlePlaces');
  const url = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`;

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = url;
    script.id = 'googlePlaces';
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) {
        callback();
      }
    };
  }

  if (existingScript && callback) {
    callback();
  }
};
