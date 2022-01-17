import { CountryConfig } from "./NumberInput";

export type ValidationType =
  typeof CountryConfig[keyof typeof CountryConfig]["validation"];

export type NumberInputProps = {
  value: number | string;
  onChange?: (data: InputType) => void;
  countryCode?: keyof typeof CountryConfig;
};

export interface InputType {
  raw: number;
  formatted: string;
}
