import { TextField } from "@material-ui/core";
import { Controller } from "react-hook-form";

const DateFieldController = ({
  control,
  error,
  nameController,
  nameField,
  label,
  required = false,
  disabled = false,
}) => {
  const formatDate = (date) => {
    /* 	const day = date.substring(0, 2);
		const month = date.substring(2, 4);
		const year = `20${date.substring(4)}`;

		const initialDate = new Date(`${year}-${month}-${day} GMT-3`);

		if (isValid(initialDate)) {
			const dateFormatted = format(initialDate, 'yyyy-MM-dd');
			return dateFormatted;
		} */
    return null;
  };

  const unformatDate = (date) => {
    const [year, month, day] = date.split("-");
    const dateFormatted = `${day}${month}${year.substr(2, 2)}`;
    return dateFormatted;
  };

  return (
    <Controller
      name={nameController}
      control={control}
      render={({ field: { value, onChange } }) => {
        return (
          <TextField
            InputLabelProps={{
              shrink: true,
              pattern: "d {4}- d {2}- d {2} ",
            }}
            error={error?.[nameField]}
            helperText={error?.[nameField] ? error?.[nameField].message : null}
            value={formatDate(value)}
            onChange={(e) => onChange(unformatDate(e.target.value))}
            name={nameField}
            fullWidth
            required={required}
            label={label}
            type="date"
            disabled={disabled}
          />
        );
      }}
    />
  );
};

export default DateFieldController;
