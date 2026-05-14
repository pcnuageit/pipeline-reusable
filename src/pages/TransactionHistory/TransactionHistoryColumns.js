import { Box, Typography } from "@material-ui/core";

const columns = [
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (data_criacao) => {
      const date = new Date(data_criacao);
      const option = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      };
      const formatted = date.toLocaleDateString("pt-br", option);
      return <Typography align="center"> {formatted}</Typography>;
    },
  },
  {
    headerText: "Pagador",
    key: "pagador",
    CustomValue: (pagador) => (
      <Box display="flex" flexDirection="column">
        <Typography>{pagador ? pagador.nome : ""}</Typography>
        <Typography>{pagador ? pagador.documento : ""}</Typography>
      </Box>
    ),
  },
  {
    headerText: "Situação",
    key: "transaction",
    CustomValue: (value) => {
      <Typography>RRR{value ? value.Status : ""}</Typography>;
    },
  },
  {
    headerText: "Tipo",
    key: "transaction.payment_type",
    CustomValue: (type) => {
      if (type === "credit") {
        return <Typography>Crédito</Typography>;
      }
      if (type === "debit") {
        return <Typography>Débito</Typography>;
      }
      if (type === "boleto") {
        return <Typography>Boleto</Typography>;
      }
      if (type === "commission") {
        return <Typography>Comissão</Typography>;
      }
      if (type === "pix") {
        return <Typography>Pix</Typography>;
      }
    },
  },
  {
    headerText: "Valor Bruto",
    key: "transaction.amount",
    CustomValue: (valor) => (
      <Typography>
        R${" "}
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },
  {
    headerText: "Valor da taxa",
    key: "transaction.fees",
    CustomValue: (valor) => (
      <Typography>
        R${" "}
        {parseFloat(valor).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
    ),
  },

  {
    headerText: "Valor Líquido",
    key: "transaction.TotalValue",
    CustomValue: (transaction) => {
      const { fees, amount } = transaction;
      const valorLiquido = (amount - fees).toFixed(2);
      return (
        <Typography>
          R${" "}
          {parseFloat(valorLiquido).toLocaleString("pt-br", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Typography>
      );
    },
  },
];

export default columns;
