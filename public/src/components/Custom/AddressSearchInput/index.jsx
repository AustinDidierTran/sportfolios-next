import React, { useEffect, useRef } from 'react';

import { GOOGLE_PLACES_API_KEY } from '../../../../../conf';
import styles from './AddressSearchInput.module.css';
import { v4 as uuidv4 } from 'uuid';

// REFERENCE: https://medium.com/better-programming/the-best-practice-with-google-place-autocomplete-api-on-react-939211e8b4ce
// REFERENCE: https://cleverbeagle.com/blog/articles/tutorial-how-to-load-third-party-scripts-dynamically-in-javascript

let autoComplete;

function AddressSearchInput(props) {
  const {
    language: languageProp,
    addressChanged,
    onChange,
    formik,
    namespace,
    country,
    errorFormat,
    placeholder,
    noValidate,
    required = true,
    hidden,
  } = props;
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadGooglePlaces(`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_PLACES_API_KEY}&libraries=places`, () =>
      handleScriptLoad(autoCompleteRef)
    );
  }, []);

  const loadGooglePlaces = (url, callback) => {
    const existingScript = document.getElementById('googlePlaces');

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = url;
      script.id = 'googlePlaces';
      document.body.appendChild(script);

      script.onload = () => {
        if (callback) callback();
      };
    }

    if (existingScript && callback) callback();
  };

  function handleScriptLoad(autoCompleteRef) {
    const options = {
      sessiontoken: uuidv4(),
      types: ['address'],
      componentRestrictions: { country },
      language: `${languageProp}`,
    };

    autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, options);
    autoComplete.setFields(['address_components', 'formatted_address']);
    autoComplete.addListener('place_changed', () => handlePlaceSelect());
  }

  const PLACES_CATEGORIES = {
    STREET_NUMBER: 'street_number',
    ROUTE: 'route',
    LOCALITY: 'locality',
    STATE: 'administrative_area_level_1',
    COUNTRY: 'country',
    ZIP: 'postal_code',
  };

  async function handlePlaceSelect() {
    const addressObject = autoComplete.getPlace();
    const fullAddress = addressObject.address_components;

    let street_number = '';
    let route = '';
    let outputAddress = {
      street_address: null,
      city: null,
      state: null,
      country: null,
      zip: null,
    };
    if (fullAddress) {
      fullAddress.forEach((e) => {
        if (e.types.includes(PLACES_CATEGORIES.STREET_NUMBER)) {
          street_number = e.long_name;
        }
        if (e.types.includes(PLACES_CATEGORIES.ROUTE)) {
          route = e.long_name;
        }
        outputAddress.street_address = `${street_number} ${route}`;
        if (e.types.includes(PLACES_CATEGORIES.LOCALITY)) {
          outputAddress.city = e.long_name;
        }
        if (e.types.includes(PLACES_CATEGORIES.STATE)) {
          outputAddress.state = e.short_name;
        }
        if (e.types.includes(PLACES_CATEGORIES.COUNTRY)) {
          outputAddress.country = e.long_name;
        }
        if (e.types.includes(PLACES_CATEGORIES.ZIP)) {
          outputAddress.zip = e.long_name;
        }
      });

      if (
        noValidate ||
        (outputAddress.street_address &&
          outputAddress.city &&
          outputAddress.state &&
          outputAddress.country &&
          outputAddress.zip)
      ) {
        formik.setFieldValue(namespace, addressObject.formatted_address);

        addressChanged(outputAddress, addressObject.formatted_address);
      } else {
        addressChanged('');
      }
    }
  }

  const handleChange = (event, ...args) => {
    if (formik) {
      formik.handleChange(event, ...args);
    }

    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div hidden={hidden}>
      {errorFormat && <div style={{ color: 'red' }}>{errorFormat}</div>}
      <div className={styles.searchLocationInput} autoComplete="off">
        <input
          autoComplete="false"
          type="text"
          ref={autoCompleteRef}
          id={namespace}
          name={namespace}
          value={(formik && formik.values[namespace]) || ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
}

export default AddressSearchInput;
