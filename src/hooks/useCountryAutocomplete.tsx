import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store';

function useCountryAutocomplete() {
  const countries = useSelector((state: RootState) => state.countries);
  const [countryInput, setCountryInput] = useState('');
  const countryInputRef = useRef<HTMLInputElement>(null);
  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countryInput.trim().toLowerCase())
  );
    return { countryInput, setCountryInput, filteredCountries, countryInputRef };
}

export default useCountryAutocomplete;