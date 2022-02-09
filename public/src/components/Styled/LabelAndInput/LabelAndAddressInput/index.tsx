import React, { useEffect, useRef } from 'react';
import { generateAutoComplete, loadGooglePlaces } from '../../../../utils/GoogleMaps';
import { v4 as uuidv4 } from 'uuid';

let autoComplete;

export const AddressInput = (props) => {
  const ref = useRef<HTMLInputElement>(null);

  const onChange = () => {};

  const handleScriptLoad = (ref: HTMLInputElement, { country = 'ca', language = 'fr' } = {}) => {
    const options = {
      sessiontoken: uuidv4(),
      types: ['address'],
      componentRestriction: { country },
      language,
    };

    autoComplete = new window.google.maps.places.Autocomplete(ref.current, options);
    autoComplete.setFields(['address_components', 'formatted_address']);
    autoComplete.addListener('place_changed', () => handlePlaceSelect());
  };

  useEffect(() => {
    loadGooglePlaces(() => handleScriptLoad(ref));
  }, []);

  return <input ref={ref} />;
};

const LabelAndAddressInput = (props) => {
  return (
    <div>
      <AddressInput />
    </div>
  );
};

export default LabelAndAddressInput;
