import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";

import { APP_CONFIG } from "../../constants/config";
import { getCidadeSearch } from "../../services/services";

export default function SelectCidade({
  state,
  setState,
  label = "Nome da cidade",
  multiple = false,
}) {
  const [cidades, setCidades] = useState([]);

  const getData = async () => {
    const estado = APP_CONFIG?.estado ?? "";
    try {
      const { data } = await getCidadeSearch(estado);
      setCidades(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <InputLabel
        id="select-label"
        shrink="true"
        style={{ marginBottom: "-14px" }}
      >
        {label}
      </InputLabel>
      <Select
        labelId="select-label"
        style={{ marginTop: "10px" }}
        variant="outlined"
        fullWidth
        required
        value={state}
        onChange={setState}
        multiple={multiple}
      >
        {cidades.map((item, index) => (
          <MenuItem key={index} value={item?.nome}>
            {item?.nome}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
