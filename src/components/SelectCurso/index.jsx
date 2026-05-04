import { InputLabel, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";

import useAuth from "../../hooks/useAuth";
import { getCursoSearch } from "../../services/beneficiarios";

export default function SelectCurso({ state, setState, multiple = false }) {
  const token = useAuth();
  const [cursos, setCursos] = useState([]);

  const getData = async () => {
    try {
      const { data } = await getCursoSearch(token);
      setCursos(data?.data);
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
        Curso
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
        {cursos.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}
