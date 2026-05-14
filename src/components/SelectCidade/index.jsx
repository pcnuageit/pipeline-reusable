import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";

import { getCidadeSearch } from "../../services/services";

export default function SelectCidade({ state, setState, multiple = false }) {
  const [cidades, setCidades] = useState([]);

  const getData = async () => {
    try {
      const { data } = await getCidadeSearch("GO");
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
        Nome da cidade
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
        {cidades.map((item) => (
          <MenuItem key={item?.nome} value={item?.nome}>
            {item?.nome}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
