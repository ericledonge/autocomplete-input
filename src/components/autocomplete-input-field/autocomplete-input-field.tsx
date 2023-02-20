import "./autocomplete-input-field.css";

import { useEffect, useState } from "react";

const URL = "https://restcountries.com/v3.1/name/";

export const AutoCompleteInputField = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  const fetchCountries = async (searchTerm: string) => {
    const response = await fetch(`${URL}${searchTerm}`);
    return response.json();
  };

  const handleCountryClick = (countryName) => {
    alert(countryName);
  };

  useEffect(() => {
    if (searchTerm) {
      const controller = new AbortController();
      setIsLoading(true);
      fetchCountries(searchTerm)
        .then((data) => setCountries(data))
        .finally(() => setIsLoading(false));

      return () => controller.abort();
    }
  }, [searchTerm]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (searchTerm) {
  //       fetchCountryNames(searchTerm).then((data) => {
  //         console.log(data);
  //         setData(data);
  //       });
  //     }
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, [searchTerm]);

  return (
    <>
      <label htmlFor="search">
        <input
          name="search"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
