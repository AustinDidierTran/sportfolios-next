import { GOOGLE_PLACES_API_KEY } from '../../../../conf';
import { v4 as uuidv4 } from 'uuid';

export const loadGooglePlaces = (callback: () => void) => {
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

export const generateAutoComplete = (ref, onChange = () => {}, { country = 'ca', language = 'fr' } = {}) => {
  const options = {
    sessiontoken: uuidv4(),
    types: ['address'],
    componentRestriction: { country },
    language,
  };

  const autoComplete = new window.google.maps.places.Autocomplete(ref.current, options);
  autoComplete.setFields(['address_components', 'formatted_address']);
  autoComplete.addListener('place_changed', () => handlePlaceSelect(onChange));

  return autoComplete;
};
