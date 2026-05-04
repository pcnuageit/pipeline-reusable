import { TextField } from "@material-ui/core";
import React, { useState } from "react";
import NumberFormat from "react-number-format";

export const handleValueChange = (name, setFieldValue) => (val) =>
  setFieldValue(name, val.floatValue);

const CurrencyFieldText = ({ currencySymbol, formik, ...props }) => {
  const [displayValue, setDisplayValue] = useState();

  return (
    <NumberFormat
      customInput={TextField}
      isNumericString={true}
      value={displayValue}
      maxLength={7}
      decimalSeparator=","
      thousandSeparator="."
      decimalScale={2}
      onValueChange={({ formattedValue, floatValue }) => {
        setDisplayValue({ value: formattedValue });
        formik.setFieldValue(props.name, floatValue);
      }}
      InputProps={{
        startAdornment: (
          <span style={{ marginRight: 8 }}>{currencySymbol}</span>
        ),
      }}
      {...props}
    />
  );
};

CurrencyFieldText.defaultProps = {
  currencySymbol: "R$",
};

export default CurrencyFieldText;
