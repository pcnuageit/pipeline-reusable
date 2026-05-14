import { TextField } from "@material-ui/core";
import { Controller } from "react-hook-form";

const StringFieldController = ({
  control,
  error,
  nameController,
  nameField,
  label,
  required = false,
  disabled = false,
}) => {
  return (
    <Controller
      name={nameController}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <TextField
            InputLabelProps={{ shrink: true }}
            error={error?.[nameField]}
            helperText={error?.[nameField] ? error?.[nameField].message : null}
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            name={nameField}
            fullWidth
            required={required}
            label={label}
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export default StringFieldController;
