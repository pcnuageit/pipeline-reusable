import { Typography } from "@material-ui/core";
import IndexStatusColumn from "./IndexStatusColumn";

const veiculoColumns = [
  {
    headerText: "-",
    key: "codigo_veiculo",
    CustomValue: (codigo_veiculo) => <Typography>{codigo_veiculo}</Typography>,
  },
  {
    headerText: "Placa",
    key: "placa",
    CustomValue: (placa) => <Typography>{placa}</Typography>,
  },
  {
    headerText: "Modelo",
    key: "descricao_modelo",
    CustomValue: (descricao_modelo) => (
      <Typography>{descricao_modelo}</Typography>
    ),
  },
  {
    headerText: "Situação",
    key: "codigo_situacao",
    CustomValue: (situacao) => {
      return <IndexStatusColumn status={situacao} />;
    },
  },
];

export default veiculoColumns;
