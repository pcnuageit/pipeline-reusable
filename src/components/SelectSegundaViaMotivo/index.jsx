import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useAuth from "../../hooks/useAuth";
import { getSegundaViaMotivoSearch } from "../../services/beneficiarios";

export default function SelectSegundaViaMotivo({
  state = {},
  setState = () => null,
}) {
  const token = useAuth();
  const contaSelecionada = useSelector((state) => state.conta);
  const doc = contaSelecionada?.cnpj;
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const res = await getSegundaViaMotivoSearch(token, doc);
      setData(res?.data);
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
        Motivo
      </InputLabel>
      <Select
        labelId="select-label"
        style={{ marginTop: "10px" }}
        variant="outlined"
        fullWidth
        required
        value={state}
        onChange={setState}
      >
        {data?.map((item) => (
          <MenuItem key={item?.id} value={item}>
            {item?.nome}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
