import { Typography } from "@material-ui/core";
import { TRANSACTION_STATUS } from "constants/status";

const TransactionStatusColumn = ({ status }) => {
  const color = TRANSACTION_STATUS[status]?.color;
  const statusText = TRANSACTION_STATUS[status]?.text;

  return (
    <>
      {statusText && color ? (
        <Typography
          style={{
            color: color,
            borderRadius: "27px",
          }}
        >
          <b>{statusText}</b>
        </Typography>
      ) : (
        <Typography
          style={{
            borderRadius: "27px",
          }}
        >
          <b>{status}</b>
        </Typography>
      )}
    </>
  );
};

export default TransactionStatusColumn;
