import { Typography } from "@material-ui/core";

const ReceivableTypeColumn = ({ type }) => {
  if (type === "mdr_aplication") return <Typography>Taxa App</Typography>;
  else if (type === "mdr_agent") return <Typography>Taxa Agent</Typography>;
  else if (type === "total_fee_charged") return <Typography>Taxas</Typography>;
  else if (type === "manual_ec") return <Typography>Repartição</Typography>;
  else if (type === "payment") return <Typography>Pagamento</Typography>;
  else if (type === "undefined") return <Typography>Indefinido</Typography>;
  return <Typography>Desconhecido</Typography>;
};

export default ReceivableTypeColumn;
