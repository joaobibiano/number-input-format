import { useEffect, useRef, useState } from "react";
import { InputType, NumberInputProps, ValidationType } from "./types";
import "./style.css";
import { CountrySelect } from "../CountrySelect/CountrySelect";

const formattingCharsPattern = /[(\()(\))(\s)(\-)]/g;

export const CountryConfig = {
  US: {
    prefix: "+1",
    validation: {
      pattern: /^(\d{2,3})(\d{1,3})(\d{0,4})$/,
      format: "($1) $2-$3",
    },
    lengthWithFormat: 14,
  },
  PT: {
    prefix: "+351",
    validation: {
      pattern: /^(\d{2,3})(\d{1,3})(\d{0,3})$/,
      format: "$1 $2 $3",
    },
    lengthWithFormat: 11,
  },
};

function applyFormat(input: string, validation: ValidationType) {
  return input.replace(validation.pattern, validation.format);
}

export const NumberInput = ({
  value: initialValue,
  onChange,
  countryCode = "PT",
}: NumberInputProps) => {
  const deletingTypeRef = useRef<"Delete" | "Backspace" | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [countryCodeSelect, setCountryCodeSelect] = useState(countryCode);
  const inputConfig = CountryConfig[countryCodeSelect];

  const [value, setValue] = useState<InputType>({
    raw:
      typeof initialValue === "string"
        ? parseFloat(initialValue)
        : initialValue,
    formatted: applyFormat(initialValue.toString(), inputConfig.validation),
  });

  useEffect(() => {
    setValue({
      raw: 0,
      formatted: "",
    });
    inputRef.current?.focus();
  }, [countryCodeSelect]);

  function onBlur() {
    onChange?.({
      formatted: value.formatted,
      raw: value.raw,
    });
  }

  function getClearValue(inputValue: string) {
    return inputValue.replace(formattingCharsPattern, "");
  }

  function hasUserTypedText(inputValue: string) {
    return inputValue.match(/\D/g);
  }

  function isUserUsingBackspace() {
    return deletingTypeRef.current === "Backspace";
  }

  function isUserUsingDelete() {
    return deletingTypeRef.current === "Delete";
  }

  function isFormattingChar(at: number | null) {
    if (!at) {
      return false;
    }

    return value.formatted.charAt(at).match(formattingCharsPattern);
  }

  function restoreCursorPosition(selectionStart: number | null) {
    if (!selectionStart) {
      return;
    }

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = selectionStart;
        inputRef.current.selectionEnd = selectionStart;
      }
    }, 10);
  }

  function format(event: React.ChangeEvent<HTMLInputElement>) {
    const valueEvent = event.target.value;
    const searchPrefixValue = `\\${inputConfig.prefix}`;
    let regexWithPrefix = new RegExp(searchPrefixValue, "g");

    const inputValue = valueEvent.replace(regexWithPrefix, "");

    let cleanValue = getClearValue(inputValue);

    if (hasUserTypedText(cleanValue)) return;

    if (
      event.target.selectionStart &&
      (isUserUsingBackspace() || isUserUsingDelete()) &&
      isFormattingChar(
        event.target.selectionStart - inputConfig.prefix.length - 1
      )
    ) {
      const selectionStart =
        event.target.selectionStart - inputConfig.prefix.length - 2;

      cleanValue =
        cleanValue.slice(0, selectionStart) +
        cleanValue.slice(selectionStart + 1);
    }

    const formattedValue = applyFormat(cleanValue, inputConfig.validation);

    setValue({
      formatted: formattedValue,
      raw: parseFloat(cleanValue),
    });

    if (isUserUsingDelete() || isUserUsingBackspace()) {
      restoreCursorPosition(event.target.selectionStart);
    }
  }

  const inputMaxLength =
    inputConfig.lengthWithFormat + inputConfig.prefix.length + 1;

  const getValue = () => {
    if (value.formatted && value.formatted !== "0") {
      return `${inputConfig.prefix} ${value.formatted}`;
    }

    return inputConfig.prefix;
  };

  return (
    <div className="container">
      <CountrySelect
        countryCode={countryCodeSelect}
        onChange={(ev) => setCountryCodeSelect(ev)}
      />

      <input
        className="phone-number"
        ref={inputRef}
        value={getValue()}
        onChange={format}
        onBlur={onBlur}
        onKeyDown={(ev) => {
          if (ev.key === "Delete" || ev.key === "Backspace") {
            deletingTypeRef.current = ev.key;
          } else {
            deletingTypeRef.current = null;
          }
        }}
        maxLength={inputMaxLength}
      />
    </div>
  );
};
