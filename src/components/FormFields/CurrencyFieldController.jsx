import { Controller } from "react-hook-form";
import { formatMoneyCnba } from "../../utils/moneyCnba";
import CustomCurrencyInput from "../Text/CustomCurrencyInput";

const CurrencyFieldController = ({
  control,
  error,
  nameController,
  nameField,
  label,
  required = false,
  disabled = false,
}) => {
  const unformatCurrency = (value) => {
    console.log({ initialValueChange: value });
    if (value === 0) return "0000000000000";

    const wholePart = Math.floor(value).toString();

    const decimalPart = (value % 1).toFixed(2).slice(2);

    const valueFormatted =
      wholePart.padStart(13 - decimalPart.length, "0") + decimalPart;

    return valueFormatted;
  };

  return (
    <Controller
      name={nameController}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <CustomCurrencyInput
            prefix="R$ "
            value={formatMoneyCnba(value)}
            label={label}
            onChangeEvent={(event, maskedvalue, floatvalue) =>
              onChange(unformatCurrency(floatvalue))
            }
            disabled={disabled}
            required={required}
            error={error?.[nameField]}
            errorMessage={
              error?.[nameField] ? error?.[nameField].message : null
            }
          />
        );
      }}
    />
  );
};

export default CurrencyFieldController;
