import { TextField } from "@material-ui/core";
import React from "react";

const TextFieldCpfCnpj = ({
  value,
  onChange,
  placeholder = "Digite CPF ou CNPJ",
  ...props
}) => {
  // Format the input value based on whether it looks like a CPF or CNPJ
  const formatValue = (rawValue) => {
    // Remove all non-digits
    const digitsOnly = rawValue.replace(/\D/g, "");

    // Don't format if there are no digits
    if (digitsOnly.length === 0) return "";

    // Format as CNPJ if more than 11 digits
    if (digitsOnly.length > 11) {
      // Limit to 14 digits for CNPJ
      const limitedDigits = digitsOnly.slice(0, 14);

      // Apply CNPJ formatting pattern: XX.XXX.XXX/XXXX-XX
      if (limitedDigits.length <= 2) {
        return limitedDigits;
      } else if (limitedDigits.length <= 5) {
        return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(2)}`;
      } else if (limitedDigits.length <= 8) {
        return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(
          2,
          5
        )}.${limitedDigits.slice(5)}`;
      } else if (limitedDigits.length <= 12) {
        return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(
          2,
          5
        )}.${limitedDigits.slice(5, 8)}/${limitedDigits.slice(8)}`;
      } else {
        return `${limitedDigits.slice(0, 2)}.${limitedDigits.slice(
          2,
          5
        )}.${limitedDigits.slice(5, 8)}/${limitedDigits.slice(
          8,
          12
        )}-${limitedDigits.slice(12)}`;
      }
    }
    // Format as CPF
    else {
      // Limit to 11 digits for CPF
      const limitedDigits = digitsOnly.slice(0, 11);

      // Apply CPF formatting pattern: XXX.XXX.XXX-XX
      if (limitedDigits.length <= 3) {
        return limitedDigits;
      } else if (limitedDigits.length <= 6) {
        return `${limitedDigits.slice(0, 3)}.${limitedDigits.slice(3)}`;
      } else if (limitedDigits.length <= 9) {
        return `${limitedDigits.slice(0, 3)}.${limitedDigits.slice(
          3,
          6
        )}.${limitedDigits.slice(6)}`;
      } else {
        return `${limitedDigits.slice(0, 3)}.${limitedDigits.slice(
          3,
          6
        )}.${limitedDigits.slice(6, 9)}-${limitedDigits.slice(9)}`;
      }
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatValue(rawValue);

    // Create a synthetic event with the formatted value
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: formattedValue,
      },
    };

    // Call the provided onChange with our synthetic event
    if (onChange) {
      onChange(syntheticEvent);
    }
  };

  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      variant="outlined"
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};

export default TextFieldCpfCnpj;
