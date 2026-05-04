import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { getBeneficios } from "../../services/beneficiarios";

import useAuth from "../../hooks/useAuth";

export default function SelectBeneficio({
  state,
  setState,
  multiple = false,
  filterList = true,
}) {
  const [tiposBeneficio, setTiposBeneficio] = useState([]);
  const token = useAuth();
  const id = useParams()?.id ?? "";

  const getTiposBeneficio = async () => {
    try {
      const { data } = await getBeneficios(
        token,
        filterList ? id : "",
        1,
        "",
        "mostrar=1000"
      );
      setTiposBeneficio(data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTiposBeneficio();
  }, []);

  return (
    <>
      <InputLabel id="select-label" shrink="true">
        Nome do benefício
      </InputLabel>
      <Select
        labelId="select-label"
        variant="outlined"
        fullWidth
        required
        value={state}
        onChange={setState}
        multiple={multiple}
      >
        {tiposBeneficio.map((item) => (
          <MenuItem key={item?.id} value={item?.id}>
            {item?.nome_beneficio
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "")
              .toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
