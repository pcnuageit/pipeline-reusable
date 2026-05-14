import { Box, Typography } from "@material-ui/core";

const associadoColumns = [
  {
    headerText: "-",
    key: "codigo_associado",
    CustomValue: (codigo_associado) => (
      <Typography>{codigo_associado}</Typography>
    ),
  },
  {
    headerText: "Associado",
    key: "detalhes_associado",
    FullObject: (associado) => (
      <Box display="flex" flexDirection="column">
        <Typography>{associado?.nome}</Typography>
        <Typography>CPF: {associado?.cpf}</Typography>
      </Box>
    ),
  },
  {
    headerText: "Email",
    key: "email",
    CustomValue: (email) => <Typography>{email}</Typography>,
  },
  {
    headerText: "Número",
    key: "telefone_celular",
    CustomValue: (telefone_celular) => (
      <Typography>{telefone_celular}</Typography>
    ),
  },
];

export default associadoColumns;
