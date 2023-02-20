import "./autocomplete-input-field.css";

import { useRef, useState } from "react";

const URL = "https://restcountries.com/v3.1/name/";
const DEBOUNCE_DELAY = 1000;

const fetchCountries = async (searchTerm: string, fetchOptions = {}) => {
  const response = await fetch(`${URL}${searchTerm}`, {
    method: "GET",
    ...fetchOptions,
  });
  return response.json();
};

export const AutoCompleteInputField = () => {
  const debounceTimer = useRef(0);
  const controller = useRef();

  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedFetchCountries = async (searchTerm: string) => {
    setIsLoading(true);
    setSearchTerm(searchTerm);
    clearTimeout(debounceTimer.current);

    controller.current?.abort();
    controller.current = new AbortController();

    debounceTimer.current = setTimeout(async () => {
      setCountries([]);

      try {
        if (searchTerm) {
          // setIsLoading(true); // or here, depend on our needs
          const countries = await fetchCountries(searchTerm, {
            signal: controller.current.signal,
          });
          setCountries(countries);
        }
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY);
  };

  const handleCountryClick = (countryName) => {
    alert(countryName);
  };

  return (
    <>
      <label htmlFor="search">
        <input
          name="search"
          type="text"
          value={searchTerm}
          onChange={(e) => debouncedFetchCountries(e.target.value)}
        />
        <div className={isLoading ? "loading-spinner" : null}></div>
      </label>

      <div>
        {countries.length > 0 && (
          <CountryList countries={countries} onClick={handleCountryClick} />
        )}
      </div>
    </>
  );
};

const CountryList = ({ countries, onClick }) => {
  return (
    <ul>
      {countries.map((country) => (
        <li
          key={country.name.common}
          onClick={() => onClick(country.name.common)}
        >
          {country.name.common}
        </li>
      ))}
    </ul>
  );
};
