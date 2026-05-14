import { Typography } from "@material-ui/core";
import { ACCOUNT_STATUS } from "constants/status";

const AccountStatusColumn = ({ status }) => {
  const color = ACCOUNT_STATUS[status]?.color;
  const statusText = ACCOUNT_STATUS[status]?.text;

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

export default AccountStatusColumn;
