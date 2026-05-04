import { Box, Typography } from "@material-ui/core";
import React from "react";

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
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const formatted = date.toLocaleDateString("pt-br", option);
      return <Typography align="center">{formatted}</Typography>;
    },
  },
  {
    headerText: "Pagador",
    key: "pagador",
    CustomValue: (pagador) => (
      <Box display="flex" flexDirection="column">
        <Typography>{pagador ? pagador.nome : null}</Typography>
        <Typography>{pagador ? pagador.documento : null}</Typography>
      </Box>
    ),
  },
  {
    headerText: "Situação",
    key: "transaction.status",
    CustomValue: (status) => {
      if (status === "succeeded") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            SUCESSO
          </Typography>
        );
      }
      if (status === "failed") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            FALHADA
          </Typography>
        );
      }
      if (status === "canceled") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            CANCELADA
          </Typography>
        );
      }
      if (status === "pending") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            PENDENTE
          </Typography>
        );
      }
      if (status === "new") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            NOVO
          </Typography>
        );
      }
      if (status === "pre_authorized") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            PRÉ-AUTORIZADO
          </Typography>
        );
      }
      if (status === "reversed") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            REVERTIDO
          </Typography>
        );
      }
      if (status === "refunded") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            REEMBOLSADO
          </Typography>
        );
      }
      if (status === "dispute") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            DISPUTA
          </Typography>
        );
      }
      if (status === "charged_back") {
        return (
          <Typography
            style={{
              color: "",
              borderRadius: "27px",
            }}
          >
            DEBITADO
          </Typography>
        );
      }
      if (status === "requested") {
        return (
          <Typography
            style={{
              color: "#dfad06",
              borderRadius: "27px",
            }}
          >
            CANC. SOLICITADO
          </Typography>
        );
      }
      if (status === "refused") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            CANC. RECUSADO POR STATUS
          </Typography>
        );
      }
      if (status === "rejected") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            CANC. REJEITADO
          </Typography>
        );
      }
      if (status === "error") {
        return (
          <Typography
            style={{
              color: "red",
              borderRadius: "27px",
            }}
          >
            ERRO CANCELAMENTO
          </Typography>
        );
      }
      if (status === "finished") {
        return (
          <Typography
            style={{
              color: "green",
              borderRadius: "27px",
            }}
          >
            CANC. FINALIZADO
          </Typography>
        );
      }
    },
  },
  {
    headerText: "Validação",
    key: "",
    FullObject: (data) => (
      <Box display="flex" flexDirection="column">
        {data.transaction &&
        data.transaction.error &&
        data.transaction.error.message_display ? (
          data.transaction.error.message_display
        ) : (
          <Typography style={{ color: "green" }}>APROVADO</Typography>
        )}
      </Box>
    ),
  },
  {
    headerText: "Tipo",
    key: "transaction",
    CustomValue: (transaction) => {
      const type = transaction.payment_type;
      if (type === "credit") {
        const installments = transaction.installment_plan
          ? transaction.installment_plan.number_installments
          : 1;
        const flag = transaction.payment_method.card_brand;
        return (
          <Typography>
            Crédito {installments}x - {flag}
          </Typography>
        );
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
    },
  },
  {
    headerText: "Valor Bruto",
    key: "transaction.amount",
    CustomValue: (value) => <Typography>R${value}</Typography>,
  },
  {
    headerText: "Valor da taxa",
    key: "transaction.fees",
    CustomValue: (value) => <Typography>R${value}</Typography>,
  },

  {
    headerText: "Valor Líquido",
    key: "transaction",
    CustomValue: (transaction) => {
      const { fees, amount } = transaction;
      const valorLiquido = (amount - fees).toFixed(2);
      return <Typography>R${valorLiquido}</Typography>;
    },
  },
];

export default columns;

/* import { Box, Typography } from '@material-ui/core';

import React from 'react';

const columns = [
	{
		headerText: 'Criado em',
		key: 'created_at',
		CustomValue: (data_criacao) => {
			const date = new Date(data_criacao);
			const option = {
				year: 'numeric',
				month: 'numeric',
				day: 'numeric',
			};
			const formatted = date.toLocaleDateString('pt-br', option);
			return <Typography align="center"> {formatted}</Typography>;
		},
	},
	{
		headerText: 'Pagador',
		key: 'pagador',
		CustomValue: (pagador) => (
			<Box display="flex" flexDirection="column">
				<Typography>{pagador ? pagador.nome : ''}</Typography>
				<Typography>{pagador ? pagador.documento : ''}</Typography>
			</Box>
		),
	},
	{
		headerText: 'Situação',
		key: 'transaction',
		CustomValue: (value) => {
			<Typography>RRR{value ? value.Status : ''}</Typography>;
		},
	},
	{
		headerText: 'Tipo',
		key: 'transaction.payment_type',
		CustomValue: (type) => {
			if (type === 'credit') {
				return <Typography>Crédito</Typography>;
			}
			if (type === 'debit') {
				return <Typography>Débito</Typography>;
			}
			if (type === 'boleto') {
				return <Typography>Boleto</Typography>;
			}
			if (type === 'commission') {
				return <Typography>Comissão</Typography>;
			}
			if (type === 'pix') {
				return <Typography>Pix</Typography>;
			}
		},
	},
	{
		headerText: 'Valor Bruto',
		key: 'transaction.amount',
		CustomValue: (value) => <Typography>R$ {value}</Typography>,
	},
	{
		headerText: 'Valor da taxa',
		key: 'transaction.FineValue',
		CustomValue: (value) => <Typography>R$ {value}</Typography>,
	},

	{
		headerText: 'Valor Líquido',
		key: 'transaction.TotalValue',

		CustomValue: (valor) => {
			return (
				<>
					R${' '}
					{parseFloat(valor).toLocaleString('pt-br', {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</>
			);
		},
		// CustomValue: (transaction) => {
		// 	const { fees, amount } = transaction;
		// 	const valorLiquido = (amount - fees).toFixed(2);
		// 	return <Typography>R$ {valorLiquido}</Typography>;
		// },
	},
];

export default columns;
 */
