import { Box, Typography } from "@material-ui/core";
import React from "react";

const valueColors = {
  validacao_negada: "red",
  analise: "#e9ad03",
  pendente: "#366baa",
  recusado: "darkred",
  ativo: "green",
  atrasado: "#ed757d",
  cancelado: "red",
  finalizado: "blue",
};

const mappedStatus = {
  validacao_negada: "V. Negada",
  analise: "Em Análise",
  pendente: "Pendente Ass.",
  recusado: "Recusado",
  cancelado: "Cancelado",
  ativo: "Ativo",
  atrasado: "Em atraso",
  finalizado: "Finalizado",
};

function SupportStatusBadge({ value, ...props }) {
  return (
    <Box
      padding={"4px 8px"}
      borderRadius={28}
      bgcolor={valueColors[value]}
      {...props}
    >
      <Typography variant="body2" color="secondary">
        {mappedStatus[value]}
      </Typography>
    </Box>
  );
}

export default SupportStatusBadge;
