import React, { useCallback, useEffect, useRef } from 'react';
import { loadGooglePlaces } from '../../../../utils/GoogleMaps';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import LabelAndInput from '..';

let autoComplete: google.maps.places.Autocomplete;

const AddressInputContainer = styled.div`
  display: flex;
  overflow: auto;
  border-radius: 4px;
  border: none;
  border-bottom: 1px solid ${(props) => props.theme.shadesOfGrey.light};

  input {
    height: 32px;
    width: 100%;
    border: none;
    border-radius: 4px;
  }

  input:focus {
    outline: none;
  }
`;

const PLACES_CATEGORIES = {
  STREET_NUMBER: 'street_number',
  ROUTE: 'route',
  LOCALITY: 'locality',
  STATE: 'administrative_area_level_1',
  COUNTRY: 'country',
  ZIP: 'postal_code',
};

export interface OutputAddress {
  street_address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

interface AddressInputProps {
  onChange: (formattedAddress: string) => void;
  onPlaceChange: (outputAddress: OutputAddress, formattedAddress: string) => void;
  placeholder: string;
  value: string;
}

export const AddressInput: React.FunctionComponent<AddressInputProps> = (props) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadGooglePlaces(() => handleScriptLoad(ref, {}));
  }, []);

  const handlePlaceSelect = useCallback(() => {
    const addressObject = autoComplete.getPlace();
    const fullAddress = addressObject.address_components;

    let streetNumber = '';
    let route = '';
    const outputAddress: OutputAddress = {
      street_address: null,
      city: null,
      state: null,
      country: null,
      zip: null,
    };

    if (!fullAddress) {
      return;
    }

    fullAddress.forEach((data) => {
      if (data.types.includes(PLACES_CATEGORIES.STREET_NUMBER)) {
        streetNumber = data.long_name;
      }

      if (data.types.includes(PLACES_CATEGORIES.ROUTE)) {
        route = data.long_name;
      }

      if (data.types.includes(PLACES_CATEGORIES.LOCALITY)) {
        outputAddress.city = data.long_name;
      }

      if (data.types.includes(PLACES_CATEGORIES.STATE)) {
        outputAddress.state = data.short_name;
      }

      if (data.types.includes(PLACES_CATEGORIES.COUNTRY)) {
        outputAddress.country = data.long_name;
      }

      if (data.types.includes(PLACES_CATEGORIES.ZIP)) {
        outputAddress.zip = data.long_name;
      }
    });

    outputAddress.street_address = `${streetNumber} ${route}`;

    if (props.onPlaceChange) {
      props.onPlaceChange(outputAddress, addressObject.formatted_address);
    }
  }, []);

  const handleScriptLoad = (ref: any, { country = 'ca', language = 'fr' } = {}) => {
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

  return (
    <AddressInputContainer>
      <input
        autoComplete="false"
        type="text"
        placeholder={props.placeholder}
        ref={ref}
        onChange={(e) => props.onChange(e.target.value)}
        value={props.value}
      />
    </AddressInputContainer>
  );
};

interface LabelAndAddressInputProps extends AddressInputProps {
  label: string;
}

const LabelAndAddressInput: React.FunctionComponent<LabelAndAddressInputProps> = (props) => {
  return (
    <LabelAndInput label={props.label}>
      <AddressInput
        onChange={props.onChange}
        onPlaceChange={props.onPlaceChange}
        placeholder={props.placeholder}
        value={props.value}
      />
    </LabelAndInput>
  );
};

export default LabelAndAddressInput;
