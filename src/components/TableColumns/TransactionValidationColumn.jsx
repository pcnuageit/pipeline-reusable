import { Typography } from "@material-ui/core";

const TransactionValidationColumn = ({ transaction }) => {
  if (transaction.error) {
    return (
      <Typography
        style={{
          color: "red",
          borderRadius: "27px",
        }}
      >
        <b>{transaction?.error?.message_display ?? "ERRO"}</b>
      </Typography>
    );
  }
  return (
    <Typography style={{ color: "green" }}>
      <b>APROVADO</b>
    </Typography>
  );
};

export default TransactionValidationColumn;
