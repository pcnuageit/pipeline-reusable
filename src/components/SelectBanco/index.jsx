import { FormHelperText, TextField } from "@material-ui/core";
import { Autocomplete } from "@mui/material";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { getBancos } from "../../services/services";

export default function SelectBanco({
  value = null,
  onChange = () => null,
  error,
  ...props
}) {
  const token = useAuth();
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const { data } = await getBancos(token);
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Find the selected option object from the ID
  const selectedOption = data.find((banco) => banco.valor === value) || null;

  return (
    <>
      <Autocomplete
        value={selectedOption}
        onChange={(e, newValue) => onChange(e, newValue)}
        options={data}
        getOptionLabel={(option) => option.nome || ""}
        isOptionEqualToValue={(option, value) => option.valor === value?.valor}
        renderInput={(params) => (
          <TextField
            variant="outlined"
            label="Banco"
            error={!!error}
            {...params}
          />
        )}
        {...props}
      />
      {error ? (
        <FormHelperText error>
          {Array.isArray(error) ? error.join(" ") : String(error)}
        </FormHelperText>
      ) : null}
    </>
  );
}
