import { Box, Typography } from "@material-ui/core";
import dayjs from "dayjs";
import IndexStatusColumn from "./IndexStatusColumn";

const columns = [
  {
    headerText: "Criado em",
    key: "data_emissao",
    CustomValue: (data_emissao) => {
      return (
        <Typography align="center">
          {dayjs(data_emissao).format("DD/MM/YYYY")}
        </Typography>
      );
    },
  },
  {
    headerText: "Pagador",
    key: "detalhes_associado",
    FullObject: (boleto) => (
      <Box display="flex" flexDirection="column">
        <Typography>{boleto.nome_associado}</Typography>
        <Typography>CPF: {boleto.cpf}</Typography>
      </Box>
    ),
  },
  {
    headerText: "Situação",
    key: "codigo_situacao_boleto",
    CustomValue: (situacao_boleto) => {
      return <IndexStatusColumn status={situacao_boleto} />;
    },
  },
  {
    headerText: "Valor",
    key: "valor_boleto",
    CustomValue: (value) => <Typography>R${value}</Typography>,
  },
];

export default columns;
