import { Box, Tooltip, Typography } from "@material-ui/core";
import InfoIcon from "@mui/icons-material/Info";
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
  assinado: "green",
  erro: "#ed757d",
};

const mappedStatus = {
  validacao_negada: "V. Negada",
  analise: "Análise",
  pendente: "Pendente",
  recusado: "Recusado",
  cancelado: "Cancelado",
  ativo: "Ativo",
  atrasado: "Atrasado",
  finalizado: "Finalizado",
  assinado: "Assinado",
  erro: "Erro",
};
const mappedStatusDetails = {
  validacao_negada: "V. Negada",
  analise: "Antecipação aguardando aprovacao de administrador/empresa",
  pendente: "Antecipação aprovada e aguardando assinatura do funcionario",
  recusado: "Antecipação recusada pelo administrador/empresa",
  cancelado: "Antecipação cancelada pelo administrador/empresa",
  ativo:
    "Antecipação com dinheiro liberado, aguardando proximo salario para descontar",
  atrasado: "Não utilizado",
  finalizado: "Antecipação finalizada",
  assinado:
    "Antecipação assinada pelo funcionario, mas aguardando liberacao do dinheiro",
  erro: "Erro",
};

function SupportStatusBadge({ value, ...props }) {
  return (
    <Box
      style={{
        display: "flex",
        padding: "4px 8px",
        borderRadius: 28,
        justifyContent: "space-around",
        alignItems: "center",
      }}
      bgcolor={valueColors[value]}
      {...props}
    >
      <Typography
        variant="body2"
        style={{ color: "white", marginRight: "5px" }}
      >
        {mappedStatus[value]}
      </Typography>
      <Tooltip title={mappedStatusDetails[value]}>
        <InfoIcon style={{ color: "white" }} value />
      </Tooltip>
    </Box>
  );
}

export default SupportStatusBadge;
