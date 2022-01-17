import { useState } from "react";
type AvailableCountries = "US" | "PT";

type CountrySelectProps = {
  countryCode: AvailableCountries;
  onChange: (countryCode: AvailableCountries) => void;
};

export const CountrySelect = ({
  countryCode,
  onChange,
}: CountrySelectProps) => {
  function handleChange(value: AvailableCountries) {
    onChange(value);
  }

  return (
    <select
      className="country-select"
      value={countryCode}
      onChange={(e) => handleChange(e.target.value as AvailableCountries)}
    >
      <option value="PT">🇵🇹</option>
      <option value="US">🇺🇸</option>
    </select>
  );
};
