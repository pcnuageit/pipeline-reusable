import { IconButton, Tooltip, Typography } from "@material-ui/core";

import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateTimeColumn from "../../../components/TableColumns/DateTimeColumn";
import { formatMoneyCnba } from "../../../utils/moneyCnba";

const infoText = (item) => {
  if (item.boleto) return "The bank slip was created successfully";

  if (!item.boleto && item.error_response_data) {
    const reasons = item.error_response_data.error.reasons;
    const formattedReasons = reasons.map((reason, index) => (
      <li key={index}>{reason}</li>
    ));

    return <ul>{formattedReasons}</ul>;
  }

  return "Unable to create bank slip";
};

const columns = [
  { headerText: "ID", key: "id" },
  { headerText: "Nome do pagador", key: "data.nome" },
  { headerText: "Documento do pagador", key: "data.numero_inscricao_pagador" },
  {
    headerText: "Valor do título",
    key: "data.valor_titulo",
    CustomValue: (value) => {
      return <Typography>R$ {formatMoneyCnba(value)}</Typography>;
    },
  },
  {
    headerText: "Criado em",
    key: "created_at",
    CustomValue: (created_at) => {
      return <DateTimeColumn dateTime={created_at} />;
    },
  },
  {
    headerText: "Status",
    key: "boleto",
    CustomValue: (boleto) => {
      if (boleto) {
        return (
          <Typography style={{ color: "green" }}>
            <b> OK</b>
          </Typography>
        );
      } else {
        return (
          <Typography style={{ color: "#dfad06" }}>
            <b>PENDENTE</b>
          </Typography>
        );
      }
    },
  },
  {
    headerText: "Info",
    key: "",
    FullCustom: (item) => {
      return (
        <Tooltip
          title={
            <Typography variant="body2" component="span">
              {infoText(item)}
            </Typography>
          }
        >
          <IconButton>
            <FontAwesomeIcon icon={faQuestionCircle} width="18px" />
          </IconButton>
        </Tooltip>
      );
    },
  },
];

export default columns;
