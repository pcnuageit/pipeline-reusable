import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useAuth from "../../hooks/useAuth";
import { getBeneficios } from "../../services/beneficiarios";

export default function SelectBeneficio({ state, setState, multiple = false }) {
  const me = useSelector((state) => state.me);
  const userData = useSelector((state) => state.userData);
  const token = useAuth();
  const documento = me?.documento;
  const is_estabelecimento = userData?.is_estabelecimento;
  const [tiposBeneficio, setTiposBeneficio] = useState([]);

  const getTiposBeneficio = async () => {
    try {
      const { data } = await getBeneficios(
        token,
        is_estabelecimento ? "" : documento,
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
      <InputLabel
        id="select-label"
        shrink="true"
        style={{ marginBottom: "-14px" }}
      >
        Nome do benefício
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
        {tiposBeneficio.map((item) => (
          <MenuItem key={item?.id} value={item?.id}>
            {item?.nome_beneficio}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
